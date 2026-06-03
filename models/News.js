const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a headline'],
    trim: true,
    index: true
  },
  summary: {
    type: String,
    required: [true, 'Please add an Odia summary (50-80 words)'],
    trim: true
  },
  content: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80'
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: [
      'Odisha',
      'India',
      'Government Schemes',
      'Jobs',
      'Banking',
      'Politics',
      'Technology',
      'Sports',
      'Entertainment',
      'Business'
    ],
    index: true
  },
  source: {
    type: String,
    trim: true,
    default: 'All Odisha Update'
  },
  sourceUrl: {
    type: String,
    trim: true
  },
  author: {
    type: String,
    default: 'Admin'
  },
  publishedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  views: {
    type: Number,
    default: 0
  },
  tags: {
    type: [String],
    index: true
  },
  isTrending: {
    type: Boolean,
    default: false,
    index: true
  },
  isSponsored: {
    type: Boolean,
    default: false,
    index: true
  },
  isJob: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

// Create text index for search functionality
newsSchema.index({ title: 'text', summary: 'text', category: 'text', tags: 'text' });

module.exports = mongoose.model('News', newsSchema);
