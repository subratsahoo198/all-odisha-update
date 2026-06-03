const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const NEWS_FILE = path.join(__dirname, '..', 'data', 'news.json');
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

// Helper to read JSON files safely
const readData = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
};

// Helper to write JSON files safely
const writeData = (filePath, data) => {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error.message);
    return false;
  }
};

// --- NEWS LOGIC ---

const getNewsList = (filters = {}, pagination = { page: 1, limit: 10 }) => {
  let list = readData(NEWS_FILE);

  // Sort by publishedAt desc
  list.sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt));

  // Apply filters
  if (filters.category) {
    list = list.filter(item => item.category === filters.category);
  }
  if (filters.isTrending !== undefined) {
    list = list.filter(item => item.isTrending === filters.isTrending);
  }
  if (filters.isSponsored !== undefined) {
    list = list.filter(item => item.isSponsored === filters.isSponsored);
  }
  if (filters.isJob !== undefined) {
    list = list.filter(item => item.isJob === filters.isJob);
  }

  const total = list.length;
  const page = parseInt(pagination.page) || 1;
  const limit = parseInt(pagination.limit) || 10;
  const skip = (page - 1) * limit;
  const paginatedList = list.slice(skip, skip + limit);

  return {
    data: paginatedList,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

const getTrendingNews = () => {
  const list = readData(NEWS_FILE);
  return list
    .filter(item => item.isTrending === true)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 10);
};

const searchNews = (queryStr = '', pagination = { page: 1, limit: 10 }) => {
  let list = readData(NEWS_FILE);
  const q = queryStr.toLowerCase();

  // Sort by publishedAt desc
  list.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  if (q) {
    list = list.filter(item => {
      const titleMatch = (item.title || '').toLowerCase().includes(q);
      const summaryMatch = (item.summary || '').toLowerCase().includes(q);
      const categoryMatch = (item.category || '').toLowerCase().includes(q);
      const tagsMatch = (item.tags || []).some(t => t.toLowerCase().includes(q));
      return titleMatch || summaryMatch || categoryMatch || tagsMatch;
    });
  }

  const total = list.length;
  const page = parseInt(pagination.page) || 1;
  const limit = parseInt(pagination.limit) || 10;
  const skip = (page - 1) * limit;
  const paginatedList = list.slice(skip, skip + limit);

  return {
    data: paginatedList,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

const getNewsById = (id, incrementViews = false) => {
  const list = readData(NEWS_FILE);
  const index = list.findIndex(item => item._id === id);
  if (index === -1) return null;

  if (incrementViews) {
    list[index].views = (list[index].views || 0) + 1;
    writeData(NEWS_FILE, list);
  }

  return list[index];
};

const createNews = (newsData) => {
  const list = readData(NEWS_FILE);
  
  // Create virtual object
  const newArticle = {
    _id: new Date().getTime().toString(16) + Math.random().toString(16).slice(2, 8), // Unique ID string
    title: newsData.title,
    odiaHeadline: newsData.odiaHeadline || '',
    summary: newsData.summary,
    content: newsData.content || '',
    image: newsData.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
    category: newsData.category,
    source: newsData.source || 'All Odisha Update',
    sourceUrl: newsData.sourceUrl || '',
    author: newsData.author || 'Admin',
    tags: Array.isArray(newsData.tags) ? newsData.tags : newsData.tags ? newsData.tags.split(',').map(t => t.trim()) : [],
    isTrending: newsData.isTrending === true || newsData.isTrending === 'true',
    isSponsored: newsData.isSponsored === true || newsData.isSponsored === 'true',
    isJob: newsData.isJob === true || newsData.isJob === 'true',
    views: 0,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  list.push(newArticle);
  writeData(NEWS_FILE, list);
  return newArticle;
};

const updateNews = (id, newsData) => {
  const list = readData(NEWS_FILE);
  const index = list.findIndex(item => item._id === id);
  if (index === -1) return null;

  const current = list[index];
  
  // Format tags
  let formattedTags = current.tags;
  if (newsData.tags) {
    formattedTags = Array.isArray(newsData.tags) ? newsData.tags : newsData.tags.split(',').map(t => t.trim());
  }

  const updatedArticle = {
    ...current,
    ...newsData,
    tags: formattedTags,
    isTrending: newsData.isTrending !== undefined ? (newsData.isTrending === true || newsData.isTrending === 'true') : current.isTrending,
    isSponsored: newsData.isSponsored !== undefined ? (newsData.isSponsored === true || newsData.isSponsored === 'true') : current.isSponsored,
    isJob: newsData.isJob !== undefined ? (newsData.isJob === true || newsData.isJob === 'true') : current.isJob,
    updatedAt: new Date().toISOString()
  };

  list[index] = updatedArticle;
  writeData(NEWS_FILE, list);
  return updatedArticle;
};

const deleteNews = (id) => {
  let list = readData(NEWS_FILE);
  const exists = list.some(item => item._id === id);
  if (!exists) return false;

  list = list.filter(item => item._id !== id);
  writeData(NEWS_FILE, list);
  return true;
};

// --- ANALYTICS LOGIC ---

const getAnalytics = () => {
  const list = readData(NEWS_FILE);
  const totalNews = list.length;
  const totalJobs = list.filter(item => item.isJob).length;
  const totalSponsored = list.filter(item => item.isSponsored).length;
  const totalViews = list.reduce((sum, item) => sum + (item.views || 0), 0);

  // Group by category
  const categories = {};
  list.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = { count: 0, views: 0 };
    }
    categories[item.category].count += 1;
    categories[item.category].views += (item.views || 0);
  });

  const categoryStats = Object.keys(categories).map(cat => ({
    _id: cat,
    count: categories[cat].count,
    views: categories[cat].views
  })).sort((a, b) => b.count - a.count);

  // Popular Articles
  const popularArticles = [...list]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
    .map(art => ({
      _id: art._id,
      title: art.title,
      views: art.views || 0,
      category: art.category,
      publishedAt: art.publishedAt
    }));

  return {
    totalNews,
    totalJobs,
    totalSponsored,
    totalViews,
    categoryStats,
    popularArticles
  };
};

// --- USERS LOGIC ---

const getAdminUser = (email) => {
  const users = readData(USERS_FILE);
  return users.find(u => u.email === email && u.isAdmin === true);
};

const createAdminUser = async (userData) => {
  const users = readData(USERS_FILE);
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const newUser = {
    _id: new Date().getTime().toString(16),
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    isAdmin: true,
    bookmarks: [],
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeData(USERS_FILE, users);
  return newUser;
};

const getAdminUserById = (id) => {
  const users = readData(USERS_FILE);
  const user = users.find(u => u._id === id);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

module.exports = {
  getNewsList,
  getTrendingNews,
  searchNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  getAnalytics,
  getAdminUser,
  getAdminUserById,
  createAdminUser
};
