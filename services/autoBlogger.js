const axios = require('axios');
const cheerio = require('cheerio');
const { scrapeArticle } = require('./scraper');
const { generateSummary } = require('./gemini');
const jsonDb = require('./jsonDb');
const News = require('../models/News');

/**
 * Crawls Odisha TV homepage to find recently published article URLs
 */
const getOTVLinks = async () => {
  try {
    const response = await axios.get('https://odishatv.in/', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 5000
    });
    const $ = cheerio.load(response.data);
    const links = new Set();
    
    $('a').each((i, el) => {
      let href = $(el).attr('href');
      if (href) {
        if (href.startsWith('/')) {
          href = 'https://odishatv.in' + href;
        }
        // Match OTV article pattern (typically ending with a unique article number ID)
        if (href.includes('https://odishatv.in/') && /\-\d{6,12}$/.test(href)) {
          links.add(href);
        }
      }
    });
    return Array.from(links).slice(0, 5); // Return top 5 articles
  } catch (error) {
    console.error('[Auto-Blogger] Error fetching OTV links:', error.message);
    return [];
  }
};

/**
 * Crawls Dharitri homepage to find recently published article URLs
 */
const getDharitriLinks = async () => {
  try {
    const response = await axios.get('https://www.dharitri.com/', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 5000
    });
    const $ = cheerio.load(response.data);
    const links = new Set();

    $('a').each((i, el) => {
      let href = $(el).attr('href');
      if (href) {
        if (href.includes('dharitri.com/') && href.split('/').filter(Boolean).length > 3) {
          // Avoid tags, author, and category archives
          if (!href.includes('/category/') && !href.includes('/tag/') && !href.includes('/author/') && !href.includes('/wp-content/')) {
            links.add(href);
          }
        }
      }
    });
    return Array.from(links).slice(0, 5); // Return top 5 articles
  } catch (error) {
    console.error('[Auto-Blogger] Error fetching Dharitri links:', error.message);
    return [];
  }
};

/**
 * Checks if a URL already exists in the database (either MongoDB or JSON Fallback)
 */
const checkIfArticleExists = async (url) => {
  if (global.dbConnected) {
    const count = await News.countDocuments({ sourceUrl: url });
    return count > 0;
  } else {
    const result = await jsonDb.getNewsList({}, { page: 1, limit: 1000 });
    const newsList = result.news || [];
    return newsList.some(item => item.sourceUrl === url);
  }
};

/**
 * Runs the complete Auto-Blog pipeline
 */
const runAutoBlogger = async () => {
  console.log('[Auto-Blogger] Starting automated news check...');
  
  const otvLinks = await getOTVLinks();
  const dharitriLinks = await getDharitriLinks();
  const allLinks = [...otvLinks, ...dharitriLinks];
  
  if (allLinks.length === 0) {
    console.log('[Auto-Blogger] No articles harvested from source sites.');
    return;
  }

  console.log(`[Auto-Blogger] Harvested ${allLinks.length} candidate URLs. Checking for duplicates...`);

  let addedCount = 0;

  for (const url of allLinks) {
    try {
      const exists = await checkIfArticleExists(url);
      if (exists) {
        continue; // Skip already published articles
      }

      console.log(`[Auto-Blogger] Found new article: ${url}. Scraping content...`);
      const scraped = await scrapeArticle(url);
      
      console.log('[Auto-Blogger] Summarizing and translating to Odia...');
      const summaryResult = await generateSummary(scraped.title, scraped.content, url);

      const category = summaryResult.tags && summaryResult.tags.length > 0 
        ? mapTagsToCategories(summaryResult.tags) 
        : 'Odisha';

      const newsData = {
        title: summaryResult.headline || scraped.title,
        odiaHeadline: summaryResult.odiaHeadline,
        summary: summaryResult.summary,
        image: scraped.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
        category: category,
        source: url.includes('odishatv.in') ? 'OTV News' : 'Dharitri News',
        sourceUrl: url,
        author: 'AI Auto-Blogger',
        tags: summaryResult.tags || ['Odisha', 'AutoPost'],
        isTrending: false,
        isSponsored: false,
        isJob: category === 'Jobs',
        views: Math.floor(Math.random() * 200) + 10,
        publishedAt: new Date().toISOString()
      };

      // Save article using appropriate database channel
      if (global.dbConnected) {
        const article = new News(newsData);
        await article.save();
      } else {
        await jsonDb.createNews(newsData);
      }

      console.log(`[Auto-Blogger] Successfully published: "${newsData.title}"`);
      addedCount++;
    } catch (err) {
      console.error(`[Auto-Blogger] Failed to process ${url}:`, err.message);
    }
  }

  console.log(`[Auto-Blogger] Finished news sync. Added ${addedCount} new articles.`);
};

/**
 * Maps AI generated tags to one of our defined categories
 */
const mapTagsToCategories = (tags) => {
  const categories = [
    'Odisha', 'India', 'Government Schemes', 'Jobs', 
    'Banking', 'Politics', 'Technology', 'Sports', 
    'Entertainment', 'Business'
  ];
  
  for (const tag of tags) {
    const matched = categories.find(cat => 
      cat.toLowerCase() === tag.toLowerCase() || 
      tag.toLowerCase().includes(cat.toLowerCase())
    );
    if (matched) return matched;
  }
  
  return 'Odisha'; // default fallback category
};

module.exports = { runAutoBlogger };
