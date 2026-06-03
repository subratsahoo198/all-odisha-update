const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const News = require('../models/News');
const jsonDb = require('../services/jsonDb');
const { protectAdmin } = require('../middleware/auth');

// Helper to sign JWT tokens
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_odisha_update_jwt_key_99', {
    expiresIn: '30d'
  });
};

// @desc    Register an admin (Initial setup or manual registration)
// @route   POST /api/admin/register
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, adminSecret } = req.body;

  try {
    if (global.dbConnected) {
      const adminCount = await User.countDocuments({ isAdmin: true });
      
      if (adminCount > 0 && adminSecret !== 'OdishaAdmin2026') {
        return res.status(400).json({ 
          success: false, 
          message: 'Registration restricted. If you are an admin, provide the correct adminSecret.' 
        });
      }

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      const user = await User.create({
        name,
        email,
        password,
        isAdmin: true
      });

      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      });
    } else {
      // JSON File Fallback
      if (adminSecret !== 'OdishaAdmin2026') {
        // If there is already an admin in JSON, check secret
        const existingAdmin = jsonDb.getAdminUser(email);
        if (existingAdmin) {
          return res.status(400).json({ success: false, message: 'User already exists' });
        }
      }

      const user = await jsonDb.createAdminUser({ name, email, password });
      
      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (global.dbConnected) {
      const user = await User.findOne({ email }).select('+password');

      if (user && (await user.matchPassword(password))) {
        if (!user.isAdmin) {
          return res.status(403).json({ success: false, message: 'Access denied: Admin role required' });
        }
        res.json({
          success: true,
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id)
        });
      } else {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      // JSON File Fallback login check
      const user = jsonDb.getAdminUser(email);

      // Handle the default fallback password replacement check if user hasn't modified it
      let passwordMatched = false;
      if (user) {
        if (user.password === '$2a$10$superSecretHashedPasswordPlaceholderPleaseReplace') {
          // If default unseeded JSON login is used, accept 'adminpassword123'
          passwordMatched = (password === 'adminpassword123');
        } else {
          passwordMatched = await bcrypt.compare(password, user.password);
        }
      }

      if (user && passwordMatched) {
        res.json({
          success: true,
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id)
        });
      } else {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- PROTECTED ADMIN CRUD ROUTES ---

// @desc    Create a news article
// @route   POST /api/admin/news
// @access  Private/Admin
router.post('/news', protectAdmin, async (req, res) => {
  try {
    if (global.dbConnected) {
      const {
        title,
        odiaHeadline,
        summary,
        content,
        image,
        category,
        source,
        sourceUrl,
        author,
        tags,
        isTrending,
        isSponsored,
        isJob
      } = req.body;

      const news = await News.create({
        title,
        odiaHeadline,
        summary,
        content,
        image,
        category,
        source,
        sourceUrl,
        author: author || req.user.name,
        tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map(t => t.trim()) : [],
        isTrending: isTrending === true || isTrending === 'true',
        isSponsored: isSponsored === true || isSponsored === 'true',
        isJob: isJob === true || isJob === 'true'
      });

      res.status(201).json({ success: true, data: news });
    } else {
      // JSON File Fallback
      const news = jsonDb.createNews({
        ...req.body,
        author: req.body.author || req.user.name
      });
      res.status(201).json({ success: true, data: news });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// @desc    Update a news article
// @route   PUT /api/admin/news/:id
// @access  Private/Admin
router.put('/news/:id', protectAdmin, async (req, res) => {
  try {
    if (global.dbConnected) {
      let news = await News.findById(req.params.id);

      if (!news) {
        return res.status(404).json({ success: false, message: 'News article not found' });
      }

      const { tags } = req.body;
      if (tags && !Array.isArray(tags)) {
        req.body.tags = tags.split(',').map(t => t.trim());
      }

      news = await News.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });

      res.json({ success: true, data: news });
    } else {
      // JSON File Fallback
      const news = jsonDb.updateNews(req.params.id, req.body);
      if (!news) {
        return res.status(404).json({ success: false, message: 'News article not found' });
      }
      res.json({ success: true, data: news });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// @desc    Delete a news article
// @route   DELETE /api/admin/news/:id
// @access  Private/Admin
router.delete('/news/:id', protectAdmin, async (req, res) => {
  try {
    if (global.dbConnected) {
      const news = await News.findById(req.params.id);

      if (!news) {
        return res.status(404).json({ success: false, message: 'News article not found' });
      }

      await News.deleteOne({ _id: req.params.id });

      res.json({ success: true, message: 'News article deleted successfully' });
    } else {
      // JSON File Fallback
      const deleted = jsonDb.deleteNews(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'News article not found' });
      }
      res.json({ success: true, message: 'News article deleted successfully' });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// @desc    Get admin analytics overview
// @route   GET /api/admin/analytics
// @access  Private/Admin
router.get('/analytics', protectAdmin, async (req, res) => {
  try {
    if (global.dbConnected) {
      const totalNews = await News.countDocuments();
      const totalJobs = await News.countDocuments({ isJob: true });
      const totalSponsored = await News.countDocuments({ isSponsored: true });
      
      const viewStats = await News.aggregate([
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ]);
      const totalViews = viewStats.length > 0 ? viewStats[0].totalViews : 0;

      const categoryStats = await News.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 }, views: { $sum: '$views' } } },
        { $sort: { count: -1 } }
      ]);

      const popularArticles = await News.find()
        .sort({ views: -1 })
        .limit(5)
        .select('title views category publishedAt');

      res.json({
        success: true,
        data: {
          totalNews,
          totalJobs,
          totalSponsored,
          totalViews,
          categoryStats,
          popularArticles
        }
      });
    } else {
      // JSON File Fallback
      const stats = jsonDb.getAnalytics();
      res.json({
        success: true,
        data: stats
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
