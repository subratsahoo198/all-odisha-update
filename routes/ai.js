const express = require('express');
const router = express.Router();
const { scrapeArticle } = require('../services/scraper');
const { generateSummary } = require('../services/gemini');
const { protectAdmin } = require('../middleware/auth');

// @desc    Scrape and summarize an article or summarize provided text
// @route   POST /api/ai/summarize
// @access  Private/Admin
router.post('/summarize', protectAdmin, async (req, res) => {
  const { url, rawText, title } = req.body;

  if (!url && !rawText) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please provide either a url to scrape or rawText to summarize.' 
    });
  }

  try {
    let articleTitle = title || 'Input Content';
    let articleContent = rawText || '';
    let scrapedImage = '';

    // Step 1: Scrape if URL is provided
    if (url) {
      console.log(`Starting scraper for URL: ${url}`);
      const scraped = await scrapeArticle(url);
      articleTitle = scraped.title;
      articleContent = scraped.content;
      scrapedImage = scraped.image;
    }

    if (!articleContent || articleContent.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'The extracted or provided article content is too short to generate a meaningful summary (minimum 50 characters).'
      });
    }

    // Step 2: Generate Odia Summary using Gemini
    console.log('Sending content to Gemini for summarization...');
    const aiResult = await generateSummary(articleTitle, articleContent, url);

    // Step 3: Respond with results for admin review
    res.json({
      success: true,
      data: {
        originalTitle: articleTitle,
        headline: aiResult.headline,
        odiaHeadline: aiResult.odiaHeadline,
        summary: aiResult.summary,
        tags: aiResult.tags,
        image: scrapedImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
        content: articleContent // return raw scraped content for editing
      }
    });
  } catch (error) {
    console.error('AI Processing Error:', error);
    res.status(500).json({ 
      success: false, 
      message: `Failed to process content: ${error.message}` 
    });
  }
});

module.exports = router;
