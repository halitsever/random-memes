const axios = require("axios");

const axiosInstance = axios.create({
  timeout: 30_000,
  headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36" },
});

module.exports = axiosInstance;
