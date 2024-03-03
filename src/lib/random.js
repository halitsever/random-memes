const axios = require("../utils/axios");

const random = async () => {
  try {
    const response = await axios("https://random-memes-api-ashy.vercel.app/image/get-memes");
    return response?.data;
  } catch (error) {
    throw new Error("Error fetching meme from Custom API ", error);
  }
};

module.exports = random;
