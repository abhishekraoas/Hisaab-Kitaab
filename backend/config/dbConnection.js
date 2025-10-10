const mongoose = require('mongoose');

const connectToMongoDB = async (url) => {
  try {
    await mongoose.connect(url)
    console.log('Connected to MongoDB successfully.')
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message)
    process.exit(1)
  }
}

module.exports = connectToMongoDB