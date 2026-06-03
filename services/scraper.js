const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes an article URL to extract the title, main content, and featured image.
 * @param {string} url - The URL of the news article.
 * @returns {Promise<{title: string, content: string, image: string}>}
 */
const scrapeArticle = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      timeout: 8000
    });

    const $ = cheerio.load(response.data);

    // Extract Title
    let title = $('meta[property="og:title"]').attr('content') || 
                $('meta[name="twitter:title"]').attr('content') || 
                $('h1').first().text().trim() || 
                $('title').text().trim();

    // Extract Image
    let image = $('meta[property="og:image"]').attr('content') || 
                $('meta[name="twitter:image"]').attr('content') || 
                '';
    
    // Clean up title
    if (title) {
      title = title.replace(/\s+/g, ' ').trim();
    }

    // Extract Content paragraphs
    let paragraphs = [];
    
    // Try common article containers first
    const containers = [
      'article', 
      '.article-content', 
      '.story-content', 
      '.post-content', 
      '.entry-content', 
      '.news-content',
      'main'
    ];
    
    let foundContent = false;
    for (const container of containers) {
      const containerEl = $(container);
      if (containerEl.length > 0) {
        containerEl.find('p').each((i, el) => {
          const txt = $(el).text().trim();
          if (txt.length > 40 && !txt.includes('cookie') && !txt.includes('subscribe')) {
            paragraphs.push(txt);
          }
        });
        if (paragraphs.length > 2) {
          foundContent = true;
          break;
        }
      }
    }

    // Fallback: search all paragraphs in body if no container matched
    if (!foundContent) {
      paragraphs = [];
      $('p').each((i, el) => {
        const txt = $(el).text().trim();
        // Simple heuristic to filter out headers/footers/menus
        if (txt.length > 50 && !txt.includes('copyright') && !txt.includes('all rights reserved') && !txt.includes('terms of service') && !txt.includes('privacy policy')) {
          paragraphs.push(txt);
        }
      });
    }

    const content = paragraphs.slice(0, 10).join('\n\n'); // Limit to first 10 paragraphs for summarization context

    return {
      title: title || 'Scraped Article',
      content: content || 'No readable content could be extracted.',
      image: image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80'
    };
  } catch (error) {
    console.error(`Scraping error for ${url}:`, error.message);
    throw new Error(`Failed to fetch article: ${error.message}`);
  }
};

module.exports = { scrapeArticle };
