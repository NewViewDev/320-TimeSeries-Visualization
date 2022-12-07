const axios = require("axios");

require("dotenv").config();

const dataLayer = axios.create({
  baseURL: process.env.DATALAYER_URL,
});

module.exports = dataLayer;
