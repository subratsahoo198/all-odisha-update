const fs = require('fs');
const path = require('path');

const NEWS_FILE = path.join(__dirname, '..', 'data', 'news.json');

const olderArticles = [
  {
    "_id": "art_old_001",
    "title": "Cabinet Committee Approves Rs 8,300 Cr Coastal Highway Project Linking Odisha's Paradip",
    "odiaHeadline": "ଓଡ଼ିଶାର ପାରାଦୀପକୁ ସଂଯୋଗ କରୁଥିବା ୮,୩୦୦ କୋଟିର ମେଗା କୋଷ୍ଟାଲ ହାଇୱେ ପ୍ରକଳ୍ପକୁ କ୍ୟାବିନେଟ ମଞ୍ଜୁରୀ",
    "summary": "ଓଡ଼ିଶାର ପାରାଦୀପ ଏବଂ ଗୋପାଳପୁର ବନ୍ଦର ମଧ୍ୟରେ ସଂଯୋଗୀକରଣକୁ ସୁଦୃଢ଼ କରିବା ପାଇଁ ୮,୩୦୦ କୋଟି ଟଙ୍କାର କୋଷ୍ଟାଲ ହାଇୱେ ପ୍ରକଳ୍ପକୁ କ୍ୟାବିନେଟ୍ କମିଟି ମଞ୍ଜୁରୀ ପ୍ରଦାନ କରିଛନ୍ତି। ଏହି ପ୍ରକଳ୍ପ ଦ୍ୱାରା ପର୍ଯ୍ୟଟନ ଓ ବାଣିଜ୍ୟ କ୍ଷେତ୍ରରେ ବଡ଼ ବିପ୍ଳବ ଆସିବ ବୋଲି ଆଶା କରାଯାଉଛି।",
    "image": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    "category": "Odisha",
    "source": "OTV News",
    "sourceUrl": "https://odishatv.in/odisha/cabinet-committee-approves-rs-8300-cr-coastal-highway-project-linking-odishas-paradip-and-rameshwar-11903752",
    "author": "OTV Reporter",
    "tags": ["Odisha", "CoastalHighway", "CabinetDecision"],
    "isTrending": true,
    "isSponsored": false,
    "isJob": false,
    "views": 850,
    "publishedAt": new Date(Date.now() - 3600000 * 28).toISOString() // 28 hours ago
  },
  {
    "_id": "art_old_002",
    "title": "El Nino Effect: Monsoon Rainfall Likely to Decline by 10% in North Odisha",
    "odiaHeadline": "ଏଲ୍ ନିନୋ ପ୍ରଭାବ: ଓଡ଼ିଶାରେ ମୌସୁମୀ ବର୍ଷା ୧୦ ପ୍ରତିଶତ ହ୍ରାସ ପାଇବା ସମ୍ଭାବନା",
    "summary": "ଏଲ୍ ନିନୋ ପ୍ରଭାବ ଯୋଗୁଁ ଚଳିତ ବର୍ଷ ଓଡ଼ିଶାରେ ମୌସୁମୀ ବର୍ଷାର ପରିମାଣ ପ୍ରାୟ ୧୦% ହ୍ରାସ ପାଇବାର ସମ୍ଭାବନା ଅଛି ବୋଲି ପାଣିପାଗ ବିଭାଗ ପୂର୍ବାନୁମାନ କରିଛି। ବିଶେଷ କରି ଉତ୍ତର ଓଡ଼ିଶାର କୃଷି କାର୍ଯ୍ୟ ଏହା ଦ୍ୱାରା ପ୍ରଭାବିତ ହେବାର ସନ୍ଦେହ ରହିଛି।",
    "image": "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=800&q=80",
    "category": "Odisha",
    "source": "OTV News",
    "sourceUrl": "https://odishatv.in/odisha/el-nino-effect-monsoon-rainfall-likely-to-decline-by-10-north-odisha-may-receive-below-normal-rain-11903668",
    "author": "OTV Reporter",
    "tags": ["OdishaWeather", "MonsoonForecast", "ElNino"],
    "isTrending": false,
    "isSponsored": false,
    "isJob": false,
    "views": 620,
    "publishedAt": new Date(Date.now() - 3600000 * 36).toISOString() // 36 hours ago
  },
  {
    "_id": "art_old_003",
    "title": "State-wide Awareness Camps Launched for Subhadra Yojana Beneficiaries",
    "odiaHeadline": "ସୁଭଦ୍ରା ଯୋଜନା ହିତାଧିକାରୀଙ୍କ ପାଇଁ ରାଜ୍ୟବ୍ୟାପୀ ସଚେତନତା ଶିବିର ଶୁଭାରମ୍ଭ",
    "summary": "ଓଡ଼ିଶା ସରକାରଙ୍କ ପ୍ରମୁଖ ମହିଳା କଲ୍ୟାଣ ଯୋଜନା 'ସୁଭଦ୍ରା ଯୋଜନା'ର ସୁଫଳ ପ୍ରତ୍ୟେକ ଯୋଗ୍ୟ ମହିଳାଙ୍କ ନିକଟରେ ପହଞ୍ଚାଇବା ପାଇଁ ବ୍ଲକ ସ୍ତରରେ ବିସ୍ତୃତ ସଚେତନତା ଶିବିର ଆୟୋଜନ କରାଯାଉଛି। ହିତାଧିକାରୀମାନଙ୍କୁ ଆବେଦନ ପତ୍ର ପୂରଣ ଏବଂ ବ୍ୟାଙ୍କ ଖାତା ଯୋଡ଼ିବା ପ୍ରକ୍ରିୟା ସମ୍ପର୍କରେ ତାଲିମ ଦିଆଯାଉଛି।",
    "image": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
    "category": "Government Schemes",
    "source": "Sambad English",
    "sourceUrl": "https://example.com/subhadra-awareness",
    "author": "Bureau Desk",
    "tags": ["SubhadraYojana", "WomenEmpowerment", "OdishaGovt"],
    "isTrending": true,
    "isSponsored": false,
    "isJob": false,
    "views": 940,
    "publishedAt": new Date(Date.now() - 3600000 * 48).toISOString() // 2 days ago
  },
  {
    "_id": "art_old_004",
    "title": "Odisha FC Signs Top Spanish Forward Ahead of Super Cup",
    "odiaHeadline": "ସୁପର କପ୍ ପୂର୍ବରୁ ଓଡ଼ିଶା ଏଫସିରେ ସାମିଲ ହେଲେ ସ୍ପେନିସ ଷ୍ଟ୍ରାଇକର",
    "summary": "ଆଗାମୀ ସୁପର କପ୍ ଫୁଟବଲ୍ ଟୁର୍ନାମେଣ୍ଟ ପାଇଁ ଓଡ଼ିଶା ଏଫସି ଦଳକୁ ଶକ୍ତିଶାଳୀ କରିବା ପାଇଁ ସ୍ପେନର ଜଣେ ନାମୀ ଫରୱାର୍ଡ ଖେଳାଳିଙ୍କ ସହ ଚୁକ୍ତି ସ୍ୱାକ୍ଷର କରିଛି। ଦଳର ଆକ୍ରମଣ ଶୈଳୀକୁ ଏହା ଆହୁରି ମଜବୁତ କରିବ ବୋଲି ମୁଖ୍ୟ କୋଚ୍ ଆଶାବ୍ୟକ୍ତ କରିଛନ୍ତି।",
    "image": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
    "category": "Sports",
    "source": "Pragativadi",
    "sourceUrl": "https://example.com/odisha-fc-spanish-forward",
    "author": "Sports Desk",
    "tags": ["OdishaFC", "IndianFootball", "SuperCup"],
    "isTrending": false,
    "isSponsored": false,
    "isJob": false,
    "views": 430,
    "publishedAt": new Date(Date.now() - 3600000 * 60).toISOString() // 2.5 days ago
  },
  {
    "_id": "art_old_005",
    "title": "BSNL Accelerates 4G Saturation in Remote Villages of Western Odisha",
    "odiaHeadline": "ପଶ୍ଚିମ ଓଡ଼ିଶାର ଦୁର୍ଗମ ଗ୍ରାମଗୁଡ଼ିକରେ ବିଏସଏନଏଲ ୪ଜି ସେବା ସମ୍ପ୍ରସାରଣ ତ୍ୱରାନ୍ୱିତ",
    "summary": "ଭାରତ ସଞ୍ଚାର ନିଗମ ଲିମିଟେଡ୍ (BSNL) ପକ୍ଷରୁ ପଶ୍ଚିମ ଓଡ଼ିଶାର ଦୁର୍ଗମ ଏବଂ ପାହାଡ଼ିଆ ଅଞ୍ଚଳରେ ୪ଜି ସଂଯୋଗୀକରଣ କାର୍ଯ୍ୟକୁ ଦ୍ରୁତ ଗତିରେ ସମ୍ପୂର୍ଣ୍ଣ କରାଯାଉଛି। କେନ୍ଦ୍ର ସରକାରଙ୍କ ଗ୍ରାମୀଣ ଡିଜିଟାଲ୍ ସଂଯୋଗ ଅଭିଯାନ ଅଧୀନରେ ୫୦ରୁ ଅଧିକ ଗାଁ ବର୍ତ୍ତମାନ ହାଇ-ସ୍ପିଡ୍ ଇଣ୍ଟରନେଟ୍ ପାଇପାରିବେ।",
    "image": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    "category": "Technology",
    "source": "Odisha Update Bureau",
    "sourceUrl": "https://example.com/bsnl-4g-western-odisha",
    "author": "Tech Reporter",
    "tags": ["BSNL4G", "DigitalIndia", "WesternOdisha"],
    "isTrending": false,
    "isSponsored": false,
    "isJob": false,
    "views": 510,
    "publishedAt": new Date(Date.now() - 3600000 * 72).toISOString() // 3 days ago
  }
];

try {
  let currentNews = [];
  if (fs.existsSync(NEWS_FILE)) {
    const raw = fs.readFileSync(NEWS_FILE, 'utf8');
    currentNews = JSON.parse(raw);
  }

  // Filter out duplicates (based on title)
  const existingTitles = new Set(currentNews.map(item => item.title));
  const toAdd = olderArticles.filter(item => !existingTitles.has(item.title));

  if (toAdd.length > 0) {
    const updated = [...currentNews, ...toAdd]; // Append older news at the end of the list
    fs.writeFileSync(NEWS_FILE, JSON.stringify(updated, null, 2), 'utf8');
    console.log(`Successfully added ${toAdd.length} older articles (before 24h) to fallback database!`);
  } else {
    console.log("No new unique older articles found to add.");
  }
  process.exit(0);
} catch (e) {
  console.error("Error appending articles:", e.message);
  process.exit(1);
}
