const axios = require("../../utils/axios");
const subreddits = require("../../constants/subreddits");

const reddit = async ({ locale }) => {
  try {
    const subredditName = locale ? subreddits[locale] : subreddits["en"];

    const response = await axios.get(`https://www.reddit.com/r/${subredditName}/hot/.json?count=100`);
    const memeObject = response?.data;

    const randomPostId = await memeObject.data.children[Math.floor(Math.random() * memeObject.data.children.length)];

    return {
      image: randomPostId.data.url,
      category: randomPostId.data.link_flair_text,
      caption: randomPostId.data.title,
      permalink: randomPostId.data.permalink,
    };
  } catch (error) {
    throw new Error("Error fetching meme from Reddit ", error);
  }
};

module.exports = reddit;
