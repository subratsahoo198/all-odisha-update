require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount Routers
app.use('/api/news', require('./routes/news'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/ai', require('./routes/ai'));

// Fallback to index.html for undefined frontend routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  
  // Start Auto-Blogger Schedule (Checks for new news updates every 1 hour)
  const { runAutoBlogger } = require('./services/autoBlogger');
  setTimeout(() => {
    runAutoBlogger().catch(err => console.error('Initial auto-blogging failed:', err));
  }, 10000); // 10 second delay on startup to let DB/Server initialize
  
  setInterval(() => {
    runAutoBlogger().catch(err => console.error('Scheduled auto-blogging failed:', err));
  }, 60 * 60 * 1000); // Run every 1 hour
});
