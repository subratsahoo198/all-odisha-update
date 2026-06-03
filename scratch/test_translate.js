const axios = require('axios');

async function translateToOdia(text) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=or&dt=t&q=${encodeURIComponent(text)}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    // Parse the result
    if (response.data && response.data[0]) {
      const translated = response.data[0].map(item => item[0]).join('');
      return translated;
    }
    return text;
  } catch (err) {
    console.error("Translation failed:", err.message);
    return text;
  }
}

translateToOdia("Cabinet Committee approves Rs 8,300 Cr coastal highway project linking Odisha’s Paradip").then(res => {
  console.log("Translated result:", res);
});
