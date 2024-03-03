const axios = require("../utils/axios");
const subreddit = require("../constants/subreddits");

const reddit = async ({ locale, customSubredditName, fullRawBody }) => {
  try {
    const subredditName = locale ? subreddit[locale] : subreddit.en;

    const response = await axios.get(`https://www.reddit.com/r/${customSubredditName ? customSubredditName : subredditName}/hot/.json?count=100`);

    const memeObject = response?.data;

    const randomPost = await memeObject.data.children[Math.floor(Math.random() * memeObject.data.children.length)];

    return fullRawBody
      ? randomPost
      : {
          image: randomPost.data.url,
          category: randomPost.data.link_flair_text,
          caption: randomPost.data.title,
          permalink: randomPost.data.permalink,
        };
  } catch (error) {
    throw new Error(`Error fetching meme from Reddit ${error}`);
  }
};

module.exports = reddit;
