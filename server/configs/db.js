const mongoose = require('mongoose');

const connectDB = async () => { 
  try {
    await mongoose.connect('mongodb://localhost:27017/usersDB');
    console.log('Connected to usersDB');
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDB;
