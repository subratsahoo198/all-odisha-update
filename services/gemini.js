const { GoogleGenerativeAI } = require('@google/generative-ai');

// Local translation/summarization dictionary for testing and fallback
const MOCK_DICTIONARY = [
  {
    urls: [
      'odisha-governor-engages-with-gujarat-students-during-yuva-sangam-cultural-exchange-programme-11902093',
      'https://odishatv.in/odisha/odisha-governor-engages-with-gujarat-students-during-yuva-sangam-cultural-exchange-programme-11902093'
    ],
    keywords: ['governor', 'yuva sangam', 'gujarat students'],
    data: {
      headline: "Odisha Governor Engages With Gujarat Students During Yuva Sangam",
      odiaHeadline: "ଯୁବ ସଙ୍ଗମ ସାଂସ୍କୃତିକ ଆଦାନ ପ୍ରଦାନ କାର୍ଯ୍ୟକ୍ରମରେ ଗୁଜରାଟର ଛାତ୍ରଛାତ୍ରୀଙ୍କୁ ଭେଟିଲେ ଓଡ଼ିଶା ରାଜ୍ୟପାଳ",
      summary: "ଓଡ଼ିଶା ରାଜ୍ୟପାଳ ରଘୁବର ଦାସ ଭୁବନେଶ୍ୱରସ୍ଥିତ ରାଜଭବନରେ ଗୁଜରାଟରୁ ଆସିଥିବା ଯୁବ ପ୍ରତିନିଧି ଦଳ ସହ ଆଲୋଚନା କରିଛନ୍ତି। ଏକ ଭାରତ ଶ୍ରେଷ୍ଠ ଭାରତ ଅଧୀନରେ ଆୟୋଜିତ ଏହି ଯୁବ ସଙ୍ଗମ ସାଂସ୍କୃତିକ ବିନିମୟ କାର୍ଯ୍ୟକ୍ରମ ଦେଶର ବିଭିନ୍ନ ରାଜ୍ୟ ମଧ୍ୟରେ ସଂହତି ଓ ସଂସ୍କୃତିକୁ ଆହୁରି ସମୃଦ୍ଧ କରିବ ବୋଲି ସେ ମତ ଦେଇଛନ୍ତି।",
      tags: ["Odisha", "YouthExchange", "RajBhawan"]
    }
  },
  {
    urls: [
      'skeleton-recovered-from-abandoned-mill-nearly-after-18-months-family-suspects-murder-11902101',
      'https://odishatv.in/odisha/skeleton-recovered-from-abandoned-mill-nearly-after-18-months-family-suspects-murder-11902101'
    ],
    keywords: ['skeleton', 'abandoned mill', '18 months'],
    data: {
      headline: "Skeleton Recovered From Abandoned Mill After 18 Months; Family Suspects Murder",
      odiaHeadline: "୧୮ ମାସ ପରେ ପରିତ୍ୟକ୍ତ ମିଲ୍ ଭିତରୁ ନରକଙ୍କାଳ ଉଦ୍ଧାର, ହତ୍ୟା ଅଭିଯୋଗ ଆଣିଲା ପରିବାର",
      summary: "ଓଡ଼ିଶାର ଏକ ପରିତ୍ୟକ୍ତ ଚାଉଳ ମିଲ୍ ପରିସରରୁ ଦୀର୍ଘ ୧୮ ମାସ ପରେ ଏକ ନରକଙ୍କାଳ ଉଦ୍ଧାର କରାଯାଇଛି। ସ୍ଥାନୀୟ ପୋଲିସ ଘଟଣାସ୍ଥଳରେ ପହଞ୍ଚି ତଦନ୍ତ ଆରମ୍ଭ କରିଥିବା ବେଳେ ମୃତକଙ୍କ ପରିବାର ଏହାକୁ ଏକ ନିର୍ମମ ହତ୍ୟାକାଣ୍ଡ ବୋଲି ସନ୍ଦେହ କରି ଉଚ୍ଚସ୍ତରୀୟ ତଦନ୍ତ ଦାବି କରିଛନ୍ତି।",
      tags: ["Odisha", "CrimeNews", "SkeletonRecovered"]
    }
  },
  {
    urls: [
      'ganjam-custodial-death-odisha-police-transfers-27-personnel-following-igs-order-11903691',
      'https://odishatv.in/odisha/ganjam-custodial-death-odisha-police-transfers-27-personnel-following-igs-order-11903691'
    ],
    keywords: ['ganjam', 'custodial death', 'transfers 27'],
    data: {
      headline: "Ganjam Custodial Death: Odisha Police Transfers 27 Personnel",
      odiaHeadline: "ଗଞ୍ଜାମ କାରାଗାର ମୃତ୍ୟୁ ଘଟଣା: ଆଇଜିଙ୍କ ନିର୍ଦ୍ଦେଶ ପରେ ୨୭ ପୋଲିସ କର୍ମଚାରୀ ବଦଳି",
      summary: "ଗଞ୍ଜାମ ଜିଲ୍ଲାରେ ଘଟିଥିବା ପୋଲିସ ହେପାଜତରେ ମୃତ୍ୟୁ ମାମଲାରେ ଏକ ବଡ଼ କାର୍ଯ୍ୟାନୁଷ୍ଠାନ ଗ୍ରହଣ କରାଯାଇଛି। ଦକ୍ଷିଣାଞ୍ଚଳ ଆଇଜିଙ୍କ ନିର୍ଦ୍ଦେଶକ୍ରମେ ସ୍ଥାନୀୟ ଥାନାର ୨୭ ଜଣ ପୋଲିସ କର୍ମଚାରୀଙ୍କୁ ତୁରନ୍ତ ଅନ୍ୟତ୍ର ବଦଳି କରାଯାଇଛି। ଏହି ଘଟଣାରେ ବିଭାଗୀୟ ତଦନ୍ତ ଜାରି ରହିଛି।",
      tags: ["Ganjam", "OdishaPolice", "CustodialDeath"]
    }
  },
  {
    urls: [
      'man-trapped-inside-shiva-temple-in-dhenkanal-after-alleged-night-time-theft-attempt-11902890',
      'https://odishatv.in/odisha/man-trapped-inside-shiva-temple-in-dhenkanal-after-alleged-night-time-theft-attempt-11902890'
    ],
    keywords: ['shiva temple', 'dhenkanal', 'theft attempt'],
    data: {
      headline: "Thief Trapped Inside Shiva Temple In Dhenkanal After Night-Time Theft Attempt",
      odiaHeadline: "ଢେଙ୍କାନାଳରେ ଶିବ ମନ୍ଦିର ଭିତରେ ଚୋରି ଉଦ୍ୟମ ବେଳେ ଫସିଗଲା ଚୋର",
      summary: "ଢେଙ୍କାନାଳ ଜିଲ୍ଲାର ଏକ ପ୍ରସିଦ୍ଧ ଶିବ ମନ୍ଦିରରେ ବିଳମ୍ବିତ ରାତିରେ ଚୋରି କରିବାକୁ ଉଦ୍ୟମ କରୁଥିବା ବେଳେ ଜଣେ ଯୁବକ ଗର୍ଭଗୃହ ମଧ୍ୟରେ ଫସି ଯାଇଥିଲେ। ସକାଳେ ପୂଜକ ମନ୍ଦିର ଖୋଲିବା ପରେ ତାଙ୍କୁ ଉଦ୍ଧାର କରାଯାଇ ପୋଲିସ ଜିମା ଦିଆଯାଇଛି।",
      tags: ["Dhenkanal", "TempleTheft", "OdishaNews"]
    }
  },
  {
    urls: [
      'gambling-was-going-on-in-the-forest-police-arrested-22-gamblers',
      'https://www.dharitri.com/gambling-was-going-on-in-the-forest-police-arrested-22-gamblers/'
    ],
    keywords: ['gambling', 'forest', '22 gamblers'],
    data: {
      headline: "Gambling Ring Busted In Forest; Police Arrest 22 Gamblers",
      odiaHeadline: "ଜଙ୍ଗଲ ଭିତରେ ଚାଲିଥିଲା ଜୁଆ ଆଡ୍ଡା: ୨୨ ଜୁଆଡ଼ିଙ୍କୁ ଗିରଫ କଲା ପୋଲିସ",
      summary: "ଓଡ଼ିଶାର ଏକ ସ୍ଥାନୀୟ ଜଙ୍ଗଲରେ ବେଆଇନ ଭାବେ ଚାଲିଥିବା ଜୁଆ ଖେଳ ଉପରେ ଚଢ଼ାଉ କରି ପୋଲିସ ୨୨ ଜଣ ଅଭିଯୁକ୍ତଙ୍କୁ ଗିରଫ କରିଛି। ସେମାନଙ୍କ ନିକଟରୁ ବହୁ ପରିମାଣର ନଗଦ ଟଙ୍କା ଏବଂ ମୋବାଇଲ୍ ଫୋନ୍ ଜବତ କରାଯାଇଛି।",
      tags: ["OdishaCrime", "GamblingRaid", "ForestRaid"]
    }
  },
  {
    urls: [
      'petrol-pumps-will-get-advance-money-for-government-vehicles',
      'https://www.dharitri.com/petrol-pumps-will-get-advance-money-for-government-vehicles-a-big-decision-by-the-odisha-government/'
    ],
    keywords: ['petrol pumps', 'advance money', 'government vehicles'],
    data: {
      headline: "Petrol Pumps To Receive Advance Payments For Government Vehicles",
      odiaHeadline: "ସରକାରୀ ଗାଡ଼ି ପାଇଁ ତେଲ ପମ୍ପ ପାଇବେ ଅଗ୍ରୀମ ଅର୍ଥ: ଓଡ଼ିଶା ସରକାରଙ୍କ ବଡ଼ ନିର୍ଦ୍ଦେଶ",
      summary: "ଓଡ଼ିଶା ସରକାରଙ୍କ ପକ୍ଷରୁ ସରକାରୀ ଯାନବାହନଗୁଡ଼ିକ ପାଇଁ ଏକ ବଡ଼ ନିଷ୍ପତ୍ତି ନିଆଯାଇଛି। ବର୍ତ୍ତମାନ ତେଲ ପମ୍ପଗୁଡ଼ିକୁ ପେଟ୍ରୋଲ ଓ ଡିଜେଲ ବାବଦରେ ଅଗ୍ରୀମ ଅର୍ଥ ପ୍ରଦାନ କରାଯିବ, ଯାହା ଦ୍ୱାରା ଜରୁରୀକାଳୀନ ସେବାରେ ନିୟୋଜିତ ଯାନଗୁଡ଼ିକର ଯାତ୍ରା ବାଧାପ୍ରାପ୍ତ ହେବ ନାହିଁ।",
      tags: ["OdishaGovt", "PetrolPump", "NewPolicy"]
    }
  },
  {
    urls: [
      'zila-parishad-member-commits-suicide-by-pouring-petrol-on-himself',
      'https://www.dharitri.com/zila-parishad-member-commits-suicide-by-pouring-petrol-on-himself/'
    ],
    keywords: ['zila parishad', 'suicide', 'petrol'],
    data: {
      headline: "Zilla Parishad Member Attempts Suicide By Pouring Petrol On Self",
      odiaHeadline: "ନିଜ ଦେହରେ ପେଟ୍ରୋଲ ଢାଳି ଆତ୍ମହତ୍ୟା ଉଦ୍ୟମ କଲେ ଜିଲ୍ଲା ପରିଷଦ ସଭ୍ୟ",
      summary: "ଓଡ଼ିଶାର ଜଣେ ଜିଲ୍ଲା ପରିଷଦ ସଭ୍ୟ କୌଣସି ପାରିବାରିକ କିମ୍ବା ରାଜନୈତିକ ବିବାଦ କାରଣରୁ ନିଜ ଶରୀରରେ ପେଟ୍ରୋଲ ଢାଳି ଜୀବନ ହାରିବାକୁ ଉଦ୍ୟମ କରିଛନ୍ତି। ତାଙ୍କୁ ଗୁରୁତର ଅବସ୍ଥାରେ ସ୍ଥାନୀୟ ମେଡିକାଲରେ ଭର୍ତ୍ତି କରାଯାଇଛି ଏବଂ ସ୍ୱାସ୍ଥ୍ୟାବସ୍ଥା ସ୍ଥିର ଥିବା ଜଣାପଡ଼ିଛି।",
      tags: ["OdishaNews", "SuicideAttempt", "ZillaParishad"]
    }
  },
  {
    urls: [
      'a-young-man-married-a-young-woman-in-a-lodge-and-had-physical-relations-with-her',
      'https://www.dharitri.com/a-young-man-married-a-young-woman-in-a-lodge-and-had-physical-relations-with-her/'
    ],
    keywords: ['lodge', 'married', 'young woman', 'relations'],
    data: {
      headline: "Man Arrested For Marriage Fraud And Abuse At Kalahandi Lodge",
      odiaHeadline: "ଲଜ୍‌ରେ ବିବାହ ପ୍ରଲୋଭନ ଦେଇ ଶାରୀରିକ ସମ୍ପର୍କ, ଯୁବକ ଗିରଫ",
      summary: "କଳାହାଣ୍ଡି ଜିଲ୍ଲାର ଏକ ଲଜ୍‌ରେ ଜଣେ ଯୁବତୀଙ୍କୁ ବିବାହର ପ୍ରଲୋଭନ ଦେଇ ଦୀର୍ଘ ଦିନ ଧରି ବଳପୂର୍ବକ ଶାରୀରିକ ସମ୍ପର୍କ ରଖିବା ଅଭିଯୋଗରେ ପୋଲିସ ଜଣେ ଯୁବକଙ୍କୁ ଗିରଫ କରି କୋର୍ଟ ଚାଲାଣ କରିଛି।",
      tags: ["CrimeNews", "Kalahandi", "FraudCase"]
    }
  }
];

/**
 * Generates an Odia summary, headline, and tags from an article content.
 * Supports a local dictionary fallback if API key is not configured.
 * 
 * @param {string} title - The original article title.
 * @param {string} content - The original article content.
 * @param {string} url - Optional URL to match against mock database.
 * @returns {Promise<{headline: string, summary: string, tags: string[]}>}
 */
const generateSummary = async (title, content, url = '') => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log('[Gemini service] API key not found. Using local mock/dictionary translation fallback...');
    
    // Check if the URL matches any dictionary item
    let matchedItem = null;
    if (url) {
      matchedItem = MOCK_DICTIONARY.find(item => 
        item.urls.some(u => url.toLowerCase().includes(u.toLowerCase()))
      );
    }

    // Check title if URL didn't match
    if (!matchedItem && title) {
      matchedItem = MOCK_DICTIONARY.find(item => 
        item.keywords.every(keyword => title.toLowerCase().includes(keyword)) ||
        item.urls.some(u => title.toLowerCase().includes(u.toLowerCase()))
      );
    }

    if (matchedItem) {
      return matchedItem.data;
    }

    // Generic Mock Generator if not in dictionary
    const sanitizedTitle = title || 'All Odisha Update News';
    return {
      headline: sanitizedTitle,
      odiaHeadline: `ଖବର ଅପଡେଟ୍: ${sanitizedTitle}`,
      summary: `[Mock AI Mode] ସୂଚନା ଅନୁଯାୟୀ, ${sanitizedTitle} ସମ୍ପର୍କରେ ରାଜ୍ୟରେ ଆଲୋଚନା ଜୋର ଧରିଛି। ବିଭାଗୀୟ ଅଧିକାରୀମାନେ ଏହାର ଯାଞ୍ଚ କରୁଛନ୍ତି। ଉନ୍ନୟନମୂଳକ କାର୍ଯ୍ୟକୁ ତ୍ୱରାନ୍ୱିତ କରିବା ପାଇଁ ପଦକ୍ଷେପ ଗ୍ରହଣ କରାଯାଉଛି ବୋଲି ଜଣାପଡ଼ିଛି। ସମ୍ପୂର୍ଣ୍ଣ ସୂଚନା ଶୀଘ୍ର ମିଳିବ।`,
      tags: ["OdishaNews", "LocalUpdate", "BreakingNews"]
    };
  }

  // --- Real Gemini Integration ---
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const prompt = `
    You are an expert bilingual editor for the Odia news portal "All Odisha Update".
    Your task is to read the following article title and content, and generate a concise, engaging summary and tags.
    
    Article Title: ${title}
    Article Content: ${content}
    
    Requirements:
    1. Generate a "headline": Create an engaging and concise news headline in English.
    2. Generate an "odiaHeadline": Create an engaging news headline in Odia.
    3. Generate a "summary": A professional and accurate 50 to 80 words news summary strictly in Odia. Do not exceed 80 words. The summary should capture all key facts (who, what, where, when, why).
    4. Generate "tags": 3 to 5 relevant tags/topics (in English, e.g., "Odisha", "Jobs", "Banking", "Technology", "Scheme") representing the content.
    
    Provide the output strictly in the following JSON format:
    {
      "headline": "English Headline",
      "odiaHeadline": "Odia Headline",
      "summary": "Odia summary of 50-80 words",
      "tags": ["tag1", "tag2", "tag3"]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().trim();
    
    const parsedData = JSON.parse(jsonText);
    
    return {
      headline: parsedData.headline || title,
      odiaHeadline: parsedData.odiaHeadline || '',
      summary: parsedData.summary || '',
      tags: parsedData.tags || []
    };
  } catch (error) {
    console.error('Gemini summarization failed:', error);
    throw new Error(`AI Summarization failed: ${error.message}`);
  }
};

module.exports = { generateSummary };
