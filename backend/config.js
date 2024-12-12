// You can create a config.js file or load environment variables directly from .env file
require('dotenv').config();

const config = {
  mongoURI: process.env.MONGO_URI,
  port: process.env.PORT || 5000,
};

module.exports = config;
