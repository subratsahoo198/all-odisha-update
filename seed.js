require('dotenv').config();
const mongoose = require('mongoose');
const News = require('./models/News');
const User = require('./models/User');

const sampleNews = [
  {
    title: "Subhadra Yojana First Phase Installment Disbursed to 25 Lakh Women in Odisha",
    odiaHeadline: "ଓଡ଼ିଶାରେ ୨୫ ଲକ୍ଷ ମହିଳା ପାଇଲେ ସୁଭଦ୍ରା ଯୋଜନାର ପ୍ରଥମ କିସ୍ତି",
    summary: "ଓଡ଼ିଶା ସରକାର ସୁଭଦ୍ରା ଯୋଜନାର ପ୍ରଥମ କିସ୍ତି ବାବଦରେ ୨୫ ଲକ୍ଷରୁ ଅଧିକ ମହିଳା ହିତାଧିକାରୀଙ୍କ ବ୍ୟାଙ୍କ ଆକାଉଣ୍ଟକୁ ୫,୦୦୦ ଟଙ୍କା ଲେଖାଏଁ ପଠାଇଛନ୍ତି। ମୁଖ୍ୟମନ୍ତ୍ରୀ ଏହି ଯୋଜନାର ଅଗ୍ରଗତି ସମୀକ୍ଷା କରିଛନ୍ତି ଏବଂ ବାକି ରହିଥିବା ଯୋଗ୍ୟ ମହିଳାମାନଙ୍କୁ ଶୀଘ୍ର ଅର୍ଥ ପ୍ରଦାନ କରାଯିବ ବୋଲି ପ୍ରତିଶ୍ରୁତି ଦେଇଛନ୍ତି।",
    image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80",
    category: "Government Schemes",
    source: "OTV News",
    sourceUrl: "https://odishatv.in",
    author: "System Seed",
    tags: ["SubhadraYojana", "OdishaSchemes", "WomenEmpowerment"],
    isTrending: true,
    views: 1250
  },
  {
    title: "Odisha Government Announces Mega Recruitment Drive: 15,000 Teacher Posts vacant",
    odiaHeadline: "ରାଜ୍ୟରେ ୧୫,୦୦୦ ଶିକ୍ଷକ ପଦବୀ ପାଇଁ ବଡ଼ ନିଯୁକ୍ତି ସୁଯୋଗ",
    summary: "ଓଡ଼ିଶା ଗଣଶିକ୍ଷା ବିଭାଗ ପକ୍ଷରୁ ହାଇସ୍କୁଲ ଏବଂ ପ୍ରାଥମିକ ସ୍କୁଲଗୁଡ଼ିକରେ ୧୫,୦୦୦ରୁ ଅଧିକ ଶିକ୍ଷକ ପଦବୀ ପୂରଣ ପାଇଁ ବିଧିବଦ୍ଧ ବିଜ୍ଞପ୍ତି ପ୍ରକାଶ ପାଇଛି। ଆଗ୍ରହୀ ପ୍ରାର୍ଥୀମାନେ ଓଡ଼ିଶା ଶିକ୍ଷା ବୋର୍ଡ ୱେବସାଇଟ୍ ମାଧ୍ୟମରେ ଆସନ୍ତା ମାସ ୧୦ ତାରିଖ ସୁଦ୍ଧା ଅନଲାଇନ୍ ଆବେଦନ କରିପାରିବେ।",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80",
    category: "Jobs",
    source: "Sambad English",
    sourceUrl: "https://sambadenglish.com",
    author: "System Seed",
    tags: ["OdishaJobs", "TeacherRecruitment", "GovtJobs"],
    isJob: true,
    views: 890
  },
  {
    title: "Bhubaneswar Airport Ranked in Top 5 Cleanest Airports in India",
    odiaHeadline: "ଦେଶର ସବୁଠାରୁ ସ୍ୱଚ୍ଛ ବିମାନବନ୍ଦର ତାଲିକାରେ ଭୁବନେଶ୍ୱର ସ୍ଥାନିତ",
    summary: "ଭୁବନେଶ୍ୱର ବିଜୁ ପଟ୍ଟନାୟକ ଆନ୍ତର୍ଜାତୀୟ ବିମାନବନ୍ଦର (BPIAT) ଭାରତୀୟ ବିମାନବନ୍ଦର ପ୍ରାଧିକରଣ (AAI) ଦ୍ୱାରା ପ୍ରକାଶିତ ସର୍ବେକ୍ଷଣ ଅନୁଯାୟୀ ସ୍ୱଚ୍ଛତା ଏବଂ ଗ୍ରାହକ ସେବାରେ ଶ୍ରେଷ୍ଠ ୫ଟି ବିମାନବନ୍ଦର ମଧ୍ୟରେ ସ୍ଥାନ ପାଇଛି। ଏହା ଓଡ଼ିଶାର ପର୍ଯ୍ୟଟନ ଶିଳ୍ପକୁ ଆହୁରି ମଜବୁତ କରିବ।",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
    category: "Odisha",
    source: "Dharitri News",
    sourceUrl: "https://dharitri.com",
    author: "System Seed",
    tags: ["Bhubaneswar", "OdishaTourism", "AirportCleanliness"],
    isTrending: false,
    views: 430
  },
  {
    title: "State Bank of India Sets Up 50 New Smart ATMs Across Rural Odisha",
    odiaHeadline: "ଓଡ଼ିଶାର ଗ୍ରାମାଞ୍ଚଳରେ ୫୦ଟି ନୂଆ ସ୍ମାର୍ଟ ଏଟିଏମ୍ ସ୍ଥାପନ କଲା SBI",
    summary: "ଗ୍ରାମାଞ୍ଚଳର ଲୋକମାନଙ୍କୁ ସହଜ ବ୍ୟାଙ୍କିଙ୍ଗ୍ ସେବା ଯୋଗାଇବା ପାଇଁ ଷ୍ଟେଟ୍ ବ୍ୟାଙ୍କ ଅଫ୍ ଇଣ୍ଡିଆ ଓଡ଼ିଶାର ବିଭିନ୍ନ ଅଣ-ବ୍ୟାଙ୍କିଙ୍ଗ୍ ଅଞ୍ଚଳରେ ୫୦ଟି ନୂତନ ସ୍ମାର୍ଟ କ୍ୟାଶ୍ ଡିପୋଜିଟ୍ ଏବଂ ଉଠାଣ ମେସିନ୍ ସ୍ଥାପନ କରିଛି। ଏହା ଦ୍ୱାରା ନଗଦ କାରବାର ସହଜ ହେବ।",
    image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=800&q=80",
    category: "Banking",
    source: "Pragativadi",
    sourceUrl: "https://pragativadi.com",
    author: "System Seed",
    tags: ["BankingUpdate", "SBIOdisha", "FinancialInclusion"],
    views: 310
  },
  {
    title: "Odisha Police Launches New Cybersecurity Helpline for Online Fraud",
    odiaHeadline: "ଅନଲାଇନ୍ ଠକେଇ ରୋକିବାକୁ ଓଡ଼ିଶା ପୋଲିସର ନୂଆ ସାଇବର ସେଲ୍ ହେଲ୍ପଲାଇନ୍",
    summary: "ରାଜ୍ୟରେ ବଢୁଥିବା ଅନଲାଇନ୍ ଏବଂ ବ୍ୟାଙ୍କିଙ୍ଗ୍ ଠକେଇକୁ ରୋକିବା ପାଇଁ ଓଡ଼ିଶା ପୋଲିସ୍ ପକ୍ଷରୁ ଏକ ନୂତନ ଜରୁରୀକାଳୀନ ହେଲ୍ପଲାଇନ୍ ନମ୍ବର ଜାରି କରାଯାଇଛି। ସାଇବର ଠକେଇର ଶିକାର ହୋଇଥିବା ବ୍ୟକ୍ତିମାନେ ୨୪ ଘଣ୍ଟା ମଧ୍ୟରେ ଏହି ନମ୍ବରରେ କଲ୍ କରି ସହାୟତା ପାଇପାରିବେ।",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    category: "Technology",
    source: "Odisha Update Bureau",
    sourceUrl: "https://allodishaupdate.com",
    author: "Admin",
    tags: ["CyberSecurity", "OdishaPolice", "PublicAwareness"],
    isTrending: true,
    views: 650
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/all_odisha_update';
    console.log('Connecting to database for seeding...');
    await mongoose.connect(mongoUri);

    console.log('Clearing existing news collection...');
    await News.deleteMany({});
    
    console.log('Inserting sample news items...');
    const insertedNews = await News.insertMany(sampleNews);
    console.log(`Successfully seeded ${insertedNews.length} news items.`);

    // Check if admin user exists, if not seed one
    const adminExists = await User.findOne({ email: 'admin@allodishaupdate.com' });
    if (!adminExists) {
      console.log('Creating default administrator account...');
      const adminUser = new User({
        name: 'Administrator',
        email: 'admin@allodishaupdate.com',
        password: 'adminpassword123', // pre-save middleware will hash it
        isAdmin: true
      });
      await adminUser.save();
      console.log('Default admin account created: admin@allodishaupdate.com / adminpassword123');
    } else {
      console.log('Admin account already exists.');
    }

    console.log('Seeding finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed with error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
