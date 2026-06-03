const fs = require('fs');
const path = require('path');
const axios = require('axios');

const dbPath = path.join(__dirname, '../data/news.json');

const translateToOdia = async (text) => {
  if (!text) return '';
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=or&dt=t&q=${encodeURIComponent(text)}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      },
      timeout: 5000
    });
    if (response.data && response.data[0]) {
      return response.data[0].map(item => item[0]).join('');
    }
    return text;
  } catch (err) {
    console.error(`Error translating text "${text.substring(0, 30)}...":`, err.message);
    return text;
  }
};

async function migrate() {
  try {
    const newsList = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    console.log(`Starting migration for ${newsList.length} articles...`);

    for (let i = 0; i < newsList.length; i++) {
      const article = newsList[i];
      let updated = false;

      // Remove Mock AI Mode prefix if present
      if (article.summary && article.summary.includes('[Mock AI Mode]')) {
        article.summary = article.summary.replace(/\[Mock AI Mode\]\s*/gi, '');
        updated = true;
      }

      // If Odia headline is empty, or equals "Google News", or is in English, or has "ଖବର ଅପଡେଟ୍:" with English text
      const isOdiaMissingOrEnglish = !article.odiaHeadline ||
        article.odiaHeadline === 'Google News' ||
        article.odiaHeadline.includes('ଖବର ଅପଡେଟ୍: ') ||
        /^[A-Za-z0-9\s\-_.,:;|()'"&]+$/.test(article.odiaHeadline);

      if (isOdiaMissingOrEnglish) {
        console.log(`[${i + 1}/${newsList.length}] Translating headline: "${article.title}"`);
        const translated = await translateToOdia(article.title);
        if (translated && translated !== article.title) {
          article.odiaHeadline = translated;
          updated = true;
        } else {
          // If translation failed or returned same, set it to title to be safe
          article.odiaHeadline = article.odiaHeadline || article.title;
        }
      }

      // Also fix summary if it's in English
      const isSummaryEnglish = article.summary && /^[A-Za-z0-9\s\-_.,:;|()'"&%]+$/.test(article.summary);
      if (isSummaryEnglish) {
        console.log(`[${i + 1}/${newsList.length}] Translating summary...`);
        const translatedSum = await translateToOdia(article.summary);
        if (translatedSum) {
          article.summary = translatedSum;
          updated = true;
        }
      }

      // If updated, add a tiny delay to respect rate limit
      if (updated) {
        await new Promise(r => setTimeout(r, 200));
      }
    }

    fs.writeFileSync(dbPath, JSON.stringify(newsList, null, 2), 'utf8');
    console.log("Migration complete and database updated successfully!");
  } catch (e) {
    console.error("Migration failed:", e);
  }
}

migrate();
