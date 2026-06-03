const fs = require('fs');
const path = require('path');

const NEWS_FILE = path.join(__dirname, '..', 'data', 'news.json');

const newArticles = [
  {
    "_id": "art_24h_001",
    "title": "Odisha Governor Engages With Gujarat Students During Yuva Sangam",
    "odiaHeadline": "ଯୁବ ସଙ୍ଗମ ସାଂସ୍କୃତିକ ଆଦାନ ପ୍ରଦାନ କାର୍ଯ୍ୟକ୍ରମରେ ଗୁଜରାଟର ଛାତ୍ରଛାତ୍ରୀଙ୍କୁ ଭେଟିଲେ ଓଡ଼ିଶା ରାଜ୍ୟପାଳ",
    "summary": "ଓଡ଼ିଶା ରାଜ୍ୟପାଳ ରଘୁବର ଦାସ ଭୁବନେଶ୍ୱରସ୍ଥିତ ରାଜଭବନରେ ଗୁଜରାଟରୁ ଆସିଥିବା ଯୁବ ପ୍ରତିନିଧି ଦଳ ସହ ଆଲୋଚନା କରିଛନ୍ତି। ଏକ ଭାରତ ଶ୍ରେଷ୍ଠ ଭାରତ ଅଧୀନରେ ଆୟୋଜିତ ଏହି ଯୁବ ସଙ୍ଗମ ସାଂସ୍କୃତିକ ବିନିମୟ କାର୍ଯ୍ୟକ୍ରମ ଦେଶର ବିଭିନ୍ନ ରାଜ୍ୟ ମଧ୍ୟରେ ସଂହତି ଓ ସଂସ୍କୃତିକୁ ଆହୁରି ସମୃଦ୍ଧ କରିବ ବୋଲି ସେ ମତ ଦେଇଛନ୍ତି।",
    "image": "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=800&q=80",
    "category": "Odisha",
    "source": "OTV News",
    "sourceUrl": "https://odishatv.in/odisha/odisha-governor-engages-with-gujarat-students-during-yuva-sangam-cultural-exchange-programme-11902093",
    "author": "OTV Reporter",
    "tags": ["Odisha", "YouthExchange", "RajBhawan"],
    "isTrending": true,
    "isSponsored": false,
    "isJob": false,
    "views": 412,
    "publishedAt": new Date().toISOString()
  },
  {
    "_id": "art_24h_002",
    "title": "Skeleton Recovered From Abandoned Mill After 18 Months; Family Suspects Murder",
    "odiaHeadline": "୧୮ ମାସ ପରେ ପରିତ୍ୟକ୍ତ ମିଲ୍ ଭିତରୁ ନରକଙ୍କାଳ ଉଦ୍ଧାର, ହତ୍ୟା ଅଭିଯୋଗ ଆଣିଲା ପରିବାର",
    "summary": "ଓଡ଼ିଶାର ଏକ ପରିତ୍ୟକ୍ତ ଚାଉଳ ମିଲ୍ ପରିସରରୁ ଦୀର୍ଘ ୧୮ ମାସ ପରେ ଏକ ନରକଙ୍କାଳ ଉଦ୍ଧାର କରାଯାଇଛି। ସ୍ଥାନୀୟ ପୋଲିସ ଘଟଣାସ୍ଥଳରେ ପହଞ୍ଚି ତଦନ୍ତ ଆରମ୍ଭ କରିଥିବା ବେଳେ ମୃତକଙ୍କ ପରିବାର ଏହାକୁ ଏକ ନିର୍ମମ ହତ୍ୟାକାଣ୍ଡ ବୋଲି ସନ୍ଦେହ କରି ଉଚ୍ଚସ୍ତରୀୟ ତଦନ୍ତ ଦାବି କରିଛନ୍ତି।",
    "image": "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=800&q=80",
    "category": "Odisha",
    "source": "OTV News",
    "sourceUrl": "https://odishatv.in/odisha/skeleton-recovered-from-abandoned-mill-nearly-after-18-months-family-suspects-murder-11902101",
    "author": "OTV Reporter",
    "tags": ["Odisha", "CrimeNews", "SkeletonRecovered"],
    "isTrending": false,
    "isSponsored": false,
    "isJob": false,
    "views": 250,
    "publishedAt": new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    "_id": "art_24h_003",
    "title": "Ganjam Custodial Death: Odisha Police Transfers 27 Personnel",
    "odiaHeadline": "ଗଞ୍ଜାମ କାରାଗାର ମୃତ୍ୟୁ ଘଟଣା: ଆଇଜିଙ୍କ ନିର୍ଦ୍ଦେଶ ପରେ ୨୭ ପୋଲିସ କର୍ମଚାରୀ ବଦଳି",
    "summary": "ଗଞ୍ଜାମ ଜିଲ୍ଲାରେ ଘଟିଥିବା ପୋଲିସ ହେପାଜତରେ ମୃତ୍ୟୁ ମାମଲାରେ ଏକ ବଡ଼ କାର୍ଯ୍ୟାନୁଷ୍ଠାନ ଗ୍ରହଣ କରାଯାଇଛି। ଦକ୍ଷିଣାଞ୍ଚଳ ଆଇଜିଙ୍କ ନିର୍ଦ୍ଦେଶକ୍ରମେ ସ୍ଥାନୀୟ ଥାନାର ୨୭ ଜଣ ପୋଲିସ କର୍ମଚାରୀଙ୍କୁ ତୁରନ୍ତ ଅନ୍ୟତ୍ର ବଦଳି କରାଯାଇଛି। ଏହି ଘଟଣାରେ ବିଭାଗୀୟ ତଦନ୍ତ ଜାରି ରହିଛି।",
    "image": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    "category": "Odisha",
    "source": "OTV News",
    "sourceUrl": "https://odishatv.in/odisha/ganjam-custodial-death-odisha-police-transfers-27-personnel-following-igs-order-11903691",
    "author": "OTV Reporter",
    "tags": ["Ganjam", "OdishaPolice", "CustodialDeath"],
    "isTrending": true,
    "isSponsored": false,
    "isJob": false,
    "views": 530,
    "publishedAt": new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    "_id": "art_24h_004",
    "title": "Thief Trapped Inside Shiva Temple In Dhenkanal After Night-Time Theft Attempt",
    "odiaHeadline": "ଢେଙ୍କାନାଳରେ ଶିବ ମନ୍ଦିର ଭିତରେ ଚୋରି ଉଦ୍ୟମ ବେଳେ ଫସିଗଲା ଚୋର",
    "summary": "ଢେଙ୍କାନାଳ ଜିଲ୍ଲାର ଏକ ପ୍ରସିଦ୍ଧ ଶିବ ମନ୍ଦିରରେ ବିଳମ୍ବିତ ରାତିରେ ଚୋରି କରିବାକୁ ଉଦ୍ୟମ କରୁଥିବା ବେଳେ ଜଣେ ଯୁବକ ଗର୍ଭଗୃହ ମଧ୍ୟରେ ଫସି ଯାଇଥିଲେ। ସକାଳେ ପୂଜକ ମନ୍ଦିର ଖୋଲିବା ପରେ ତାଙ୍କୁ ଉଦ୍ଧାର କରାଯାଇ ପୋଲିସ ଜିମା ଦିଆଯାଇଛି।",
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
    "category": "Odisha",
    "source": "OTV News",
    "sourceUrl": "https://odishatv.in/odisha/man-trapped-inside-shiva-temple-in-dhenkanal-after-alleged-night-time-theft-attempt-11902890",
    "author": "OTV Reporter",
    "tags": ["Dhenkanal", "TempleTheft", "OdishaNews"],
    "isTrending": false,
    "isSponsored": false,
    "isJob": false,
    "views": 180,
    "publishedAt": new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    "_id": "art_24h_005",
    "title": "Gambling Ring Busted In Forest; Police Arrest 22 Gamblers",
    "odiaHeadline": "ଜଙ୍ଗଲ ଭିତରେ ଚାଲିଥିଲା ଜୁଆ ଆଡ୍ଡା: ୨୨ ଜୁଆଡ଼ିଙ୍କୁ ଗିରଫ କଲା ପୋଲିସ",
    "summary": "ଓଡ଼ିଶାର ଏକ ସ୍ଥାନୀୟ ଜଙ୍ଗଲରେ ବେଆଇନ ଭାବେ ଚାଲିଥିବା ଜୁଆ ଖେଳ ଉପରେ ଚଢ଼ାଉ କରି ପୋଲିସ ୨୨ ଜଣ ଅଭିଯୁକ୍ତଙ୍କୁ ଗିରଫ କରିଛି। ସେମାନଙ୍କ ନିକଟରୁ ବହୁ ପରିମାଣର ନଗଦ ଟଙ୍କା ଏବଂ ମୋବାଇଲ୍ ଫୋନ୍ ଜବତ କରାଯାଇଛି।",
    "image": "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80",
    "category": "Odisha",
    "source": "Dharitri News",
    "sourceUrl": "https://www.dharitri.com/gambling-was-going-on-in-the-forest-police-arrested-22-gamblers/",
    "author": "Dharitri Bureau",
    "tags": ["OdishaCrime", "GamblingRaid", "ForestRaid"],
    "isTrending": false,
    "isSponsored": false,
    "isJob": false,
    "views": 320,
    "publishedAt": new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    "_id": "art_24h_006",
    "title": "Petrol Pumps To Receive Advance Payments For Government Vehicles",
    "odiaHeadline": "ସରକାରୀ ଗାଡ଼ି ପାଇଁ ତେଲ ପମ୍ପ ପାଇବେ ଅଗ୍ରୀମ ଅର୍ଥ: ଓଡ଼ିଶା ସରକାରଙ୍କ ବଡ଼ ନିର୍ଦ୍ଦେଶ",
    "summary": "ଓଡ଼ିଶା ସରକାରଙ୍କ ପକ୍ଷରୁ ସରକାରୀ ଯାନବାହନଗୁଡ଼ିକ ପାଇଁ ଏକ ବଡ଼ ନିଷ୍ପତ୍ତି ନିଆଯାଇଛି। ବର୍ତ୍ତମାନ ତେଲ ପମ୍ପଗୁଡ଼ିକୁ ପେଟ୍ରୋଲ ଓ ଡିଜେଲ ବାବଦରେ ଅଗ୍ରୀମ ଅର୍ଥ ପ୍ରଦାନ କରାଯିବ, ଯାହା ଦ୍ୱାରା ଜରୁରୀକାଳୀନ ସେବାରେ ନିୟୋଜିତ ଯାନଗୁଡ଼ିକର ଯାତ୍ରା ବାଧାପ୍ରାପ୍ତ ହେବ ନାହିଁ।",
    "image": "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=800&q=80",
    "category": "Odisha",
    "source": "Dharitri News",
    "sourceUrl": "https://www.dharitri.com/petrol-pumps-will-get-advance-money-for-government-vehicles-a-big-decision-by-the-odisha-government/",
    "author": "Dharitri Bureau",
    "tags": ["OdishaGovt", "PetrolPump", "NewPolicy"],
    "isTrending": true,
    "isSponsored": false,
    "isJob": false,
    "views": 490,
    "publishedAt": new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    "_id": "art_24h_007",
    "title": "Zilla Parishad Member Attempts Suicide By Pouring Petrol On Self",
    "odiaHeadline": "ନିଜ ଦେହରେ ପେଟ୍ରୋଲ ଢାଳି ଆତ୍ମହତ୍ୟା ଉଦ୍ୟମ କଲେ ଜିଲ୍ଲା ପରିଷଦ ସଭ୍ୟ",
    "summary": "ଓଡ଼ିଶାର ଜଣେ ଜିଲ୍ଲା ପରିଷଦ ସଭ୍ୟ କୌଣସି ପାରିବାରିକ କିମ୍ବା ରାଜନୈତିକ ବିବାଦ କାରଣରୁ ନିଜ ଶରୀରରେ ପେଟ୍ରୋଲ ଢାଳି ଜୀବନ ହାରିବାକୁ ଉଦ୍ୟମ କରିଛନ୍ତି। ତାଙ୍କୁ ଗୁରୁତର ଅବସ୍ଥାରେ ସ୍ଥାନୀୟ ମେଡିକାଲରେ ଭର୍ତ୍ତି କରାଯାଇଛି ଏବଂ ସ୍ୱାସ୍ଥ୍ୟାବସ୍ଥା ସ୍ଥିର ଥିବା ଜଣାପଡ଼ିଛି।",
    "image": "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
    "category": "Odisha",
    "source": "Dharitri News",
    "sourceUrl": "https://www.dharitri.com/zila-parishad-member-commits-suicide-by-pouring-petrol-on-himself/",
    "author": "Dharitri Bureau",
    "tags": ["OdishaNews", "SuicideAttempt", "ZillaParishad"],
    "isTrending": false,
    "isSponsored": false,
    "isJob": false,
    "views": 150,
    "publishedAt": new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    "_id": "art_24h_008",
    "title": "Man Arrested For Marriage Fraud And Abuse At Kalahandi Lodge",
    "odiaHeadline": "ଲଜ୍‌ରେ ବିବାହ ପ୍ରଲୋଭନ ଦେଇ ଶାରୀରିକ ସମ୍ପର୍କ, ଯୁବକ ଗିରଫ",
    "summary": "କଳାହାଣ୍ଡି ଜିଲ୍ଲାର ଏକ ଲଜ୍‌ରେ ଯୁବତୀଙ୍କୁ ବିବାହର ପ୍ରଲୋଭନ ଦେଇ ଦୀର୍ଘ ଦିନ ଧରି ବଳପୂର୍ବକ ଶାରୀରିକ ସମ୍ପର୍କ ରଖିବା ଅଭିଯୋଗରେ ପୋଲିସ ଜଣେ ଯୁବକଙ୍କୁ ଗିରଫ କରି କୋର୍ଟ ଚାଲାଣ କରିଛି।",
    "image": "https://images.unsplash.com/photo-1505664194779-8bebcb95c539?auto=format&fit=crop&w=800&q=80",
    "category": "Odisha",
    "source": "Dharitri News",
    "sourceUrl": "https://www.dharitri.com/a-young-man-married-a-young-woman-in-a-lodge-and-had-physical-relations-with-her/",
    "author": "Dharitri Bureau",
    "tags": ["CrimeNews", "Kalahandi", "FraudCase"],
    "isTrending": false,
    "isSponsored": false,
    "isJob": false,
    "views": 270,
    "publishedAt": new Date(Date.now() - 3600000 * 20).toISOString()
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
  const toAdd = newArticles.filter(item => !existingTitles.has(item.title));

  if (toAdd.length > 0) {
    const updated = [...toAdd, ...currentNews];
    fs.writeFileSync(NEWS_FILE, JSON.stringify(updated, null, 2), 'utf8');
    console.log(`Successfully appended ${toAdd.length} new 24h articles to news.json fallback database!`);
  } else {
    console.log("No new unique articles found to add.");
  }
  process.exit(0);
} catch (e) {
  console.error("Error appending articles:", e.message);
  process.exit(1);
}
