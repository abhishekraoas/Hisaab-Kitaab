const express = require("express");
const cors = require("cors");
const connectToMongoDB = require("./config/dbConnection");
require('dotenv').config()
const app = express();

//Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000

//Checking the Server is running or not
app.get('/', (req, res) => {
  res.json({ message: 'Server is Running!!' })
})

//Server Start
const startServer = async () => {
  try {
    await connectToMongoDB(process.env.URL_DB)
    app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message)
    process.exit(1) 
  }
}

startServer()

module.exports = app;