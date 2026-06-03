const express = require('express');
const router = express.Router();
const News = require('../models/News');
const jsonDb = require('../services/jsonDb');

const sanitizeNews = (news) => {
  if (!news) return null;
  const doc = news.toObject ? news.toObject() : { ...news };
  doc.source = 'All Odisha Update';
  return doc;
};

// @desc    Get all news (paginated, option to filter by category or flag)
// @route   GET /api/news
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (global.dbConnected) {
      const skip = (page - 1) * limit;
      const query = {};

      if (req.query.category) {
        query.category = req.query.category;
      }
      if (req.query.isTrending) {
        query.isTrending = req.query.isTrending === 'true';
      }
      if (req.query.isSponsored) {
        query.isSponsored = req.query.isSponsored === 'true';
      }
      if (req.query.isJob) {
        query.isJob = req.query.isJob === 'true';
      }

      const newsList = await News.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await News.countDocuments(query);

      res.json({
        success: true,
        count: newsList.length,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          totalNews: total
        },
        data: newsList.map(sanitizeNews)
      });
    } else {
      // JSON File Fallback
      const filters = {};
      if (req.query.category) filters.category = req.query.category;
      if (req.query.isTrending) filters.isTrending = req.query.isTrending === 'true';
      if (req.query.isSponsored) filters.isSponsored = req.query.isSponsored === 'true';
      if (req.query.isJob) filters.isJob = req.query.isJob === 'true';

      const result = jsonDb.getNewsList(filters, { page, limit });

      res.json({
        success: true,
        count: result.data.length,
        pagination: {
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
          totalNews: result.total
        },
        data: result.data.map(sanitizeNews)
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @desc    Get trending news
// @route   GET /api/news/trending
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    if (global.dbConnected) {
      const trendingNews = await News.find({ isTrending: true })
        .sort({ publishedAt: -1 })
        .limit(10);
      res.json({ success: true, count: trendingNews.length, data: trendingNews.map(sanitizeNews) });
    } else {
      const trendingNews = jsonDb.getTrendingNews();
      res.json({ success: true, count: trendingNews.length, data: trendingNews.map(sanitizeNews) });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @desc    Search news (by title, category, tags or general query text)
// @route   GET /api/news/search
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const queryStr = req.query.q || '';
    if (!queryStr) {
      return res.status(400).json({ success: false, message: 'Please provide search query' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (global.dbConnected) {
      const skip = (page - 1) * limit;
      let query = {
        $or: [
          { title: { $regex: queryStr, $options: 'i' } },
          { summary: { $regex: queryStr, $options: 'i' } },
          { category: { $regex: queryStr, $options: 'i' } },
          { tags: { $regex: queryStr, $options: 'i' } }
        ]
      };

      const newsList = await News.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await News.countDocuments(query);

      res.json({
        success: true,
        count: newsList.length,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          totalNews: total
        },
        data: newsList.map(sanitizeNews)
      });
    } else {
      // JSON File Fallback
      const result = jsonDb.searchNews(queryStr, { page, limit });
      res.json({
        success: true,
        count: result.data.length,
        pagination: {
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
          totalNews: result.total
        },
        data: result.data.map(sanitizeNews)
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @desc    Get news by category
// @route   GET /api/news/category/:category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const categoryName = req.params.category;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (global.dbConnected) {
      const skip = (page - 1) * limit;
      const newsList = await News.find({ category: categoryName })
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await News.countDocuments({ category: categoryName });

      res.json({
        success: true,
        count: newsList.length,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          totalNews: total
        },
        data: newsList.map(sanitizeNews)
      });
    } else {
      // JSON File Fallback
      const result = jsonDb.getNewsList({ category: categoryName }, { page, limit });
      res.json({
        success: true,
        count: result.data.length,
        pagination: {
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
          totalNews: result.total
        },
        data: result.data.map(sanitizeNews)
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @desc    Get single news (increments view count)
// @route   GET /api/news/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    if (global.dbConnected) {
      const news = await News.findByIdAndUpdate(
        req.params.id,
        { $inc: { views: 1 } },
        { new: true }
      );

      if (!news) {
        return res.status(404).json({ success: false, message: 'News article not found' });
      }

      res.json({ success: true, data: sanitizeNews(news) });
    } else {
      // JSON File Fallback
      const news = jsonDb.getNewsById(req.params.id, true);
      if (!news) {
        return res.status(404).json({ success: false, message: 'News article not found' });
      }
      res.json({ success: true, data: sanitizeNews(news) });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
