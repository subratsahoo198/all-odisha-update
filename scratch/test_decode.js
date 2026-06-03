const axios = require('axios');
const cheerio = require('cheerio');

async function getArticleUrl(googleRssUrl) {
  try {
    const response = await axios.get(googleRssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(response.data);
    const data = $('c-wiz[data-p]').attr('data-p');
    if (!data) {
      console.log("data-p attribute not found on c-wiz!");
      return googleRssUrl;
    }
    
    const obj = JSON.parse(data.replace('%.@.', '["garturlreq",'));
    const payload = { 
      'f.req': JSON.stringify([[['Fbv4je', JSON.stringify([...obj.slice(0, -6), ...obj.slice(-2)]), 'null', 'generic']]]) 
    };
    
    const headers = { 
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
    };
    
    const postResponse = await axios.post('https://news.google.com/_/DotsSplashUi/data/batchexecute', 
      new URLSearchParams(payload).toString(), 
      { headers }
    );
    
    const arrayString = JSON.parse(postResponse.data.replace(")]}'\n", ""))[0][2];
    const decodedUrl = JSON.parse(arrayString)[1];
    return decodedUrl;
  } catch (e) {
    console.error('Decoding failed:', e.message);
    return googleRssUrl;
  }
}

// Run with a sample Google News URL
const sampleUrl = "https://news.google.com/rss/articles/CBMiekFVX3lxTE1BLU1MT19Rb0xKRWpqQjc4aG9aTUpJbndrVWRHc0l3cDRpUjBVZW5lbzE1Y19EVkdqM3U3aGhSYW1kSXR4WWtQaVRXaWN3bjR2TXF3NUZ2MENNeUhXSzFLNXgxanlpOW15SzNFckg3T05tRG5rQmtKUzV3?oc=5";

getArticleUrl(sampleUrl).then(resolved => {
  console.log("Original Google News URL:", sampleUrl);
  console.log("Decoded Publisher URL:", resolved);
}).catch(err => {
  console.error("Test error:", err);
});
