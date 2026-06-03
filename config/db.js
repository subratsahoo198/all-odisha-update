const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/all_odisha_update');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.dbConnected = true;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error('The server will continue running, but database calls will fail until MongoDB is started.');
    global.dbConnected = false;
  }
};

module.exports = connectDB;
