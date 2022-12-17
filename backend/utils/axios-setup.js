const axios = require("axios");

require("dotenv").config();

const dataLayer = axios.create({
  baseURL: process.env.DATALAYER_URL || "http://127.0.0.1:6000/api/v1",
});

module.exports = dataLayer;
