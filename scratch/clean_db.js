const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/news.json');

try {
  const newsList = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  
  // Filter out any articles that are placeholders (title is "Google News" or source is "News.google.com")
  const filtered = newsList.filter(article => {
    const isMockGoogle = article.title === "Google News" || 
                         article.source === "News.google.com" || 
                         (article.image && article.image.includes('googleusercontent.com'));
    return !isMockGoogle;
  });

  fs.writeFileSync(dbPath, JSON.stringify(filtered, null, 2), 'utf8');
  console.log(`Cleaned database! Reduced from ${newsList.length} articles to ${filtered.length} high-quality articles.`);
} catch (e) {
  console.error("Failed to clean database:", e.message);
}
