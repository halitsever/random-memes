const axios = require("../../utils/axios");

const random = async ({ apiUrl }) => {
  try {
    const response = axios(apiUrl || "https://random-memes-api.vercel.app/getmemes");
    return response?.data;
  } catch (error) {
    throw new Error("Error fetching meme from Custom API ", error);
  }
};

module.exports = random;
