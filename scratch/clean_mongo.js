const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/all-odisha-update';

const NewsSchema = new mongoose.Schema({}, { strict: false });
const News = mongoose.model('News', NewsSchema, 'news');

async function cleanMongo() {
  try {
    console.log("Connecting to MongoDB at:", mongoUri);
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 3000 });
    console.log("Connected successfully!");

    const result = await News.deleteMany({
      $or: [
        { title: "Google News" },
        { source: "News.google.com" },
        { image: { $regex: /googleusercontent\.com/ } }
      ]
    });

    console.log(`Successfully deleted ${result.deletedCount} mock google news documents from MongoDB.`);
  } catch (err) {
    console.log("MongoDB is not running or unreachable:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

cleanMongo();
