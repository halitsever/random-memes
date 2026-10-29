const { getJson } = require("../utils/http");
const { isImageUrl } = require("../utils/image");
const subreddits = require("../constants/subreddits");

let warned = false;

const reddit = async ({ locale = "en", customSubredditName, fullRawBody = false } = {}) => {
  if (!warned) {
    warned = true;
    process.emitWarning("reddit() is deprecated and will be removed in random-memes v5. Reddit blocks most unauthenticated requests.", {
      type: "DeprecationWarning",
      code: "RANDOM_MEMES_REDDIT",
    });
  }

  const subreddit = customSubredditName ?? subreddits[locale];

  if (!subreddit) {
    throw new Error(`Unknown locale "${locale}". Available locales: ${Object.keys(subreddits).join(", ")}`);
  }

  let listing;

  try {
    // raw_json=1 stops Reddit from HTML-escaping "&" in image URLs.
    listing = await getJson(`https://www.reddit.com/r/${encodeURIComponent(subreddit)}/hot.json?limit=100&raw_json=1`);
  } catch (error) {
    const hint = error.status === 403 ? " Reddit blocks most unauthenticated requests." : "";
    throw new Error(`Failed to fetch memes from r/${subreddit}.${hint}`, { cause: error });
  }

  const posts = listing.data.children.filter(({ data }) => !data.stickied && isImageUrl(data.url));

  if (posts.length === 0) {
    throw new Error(`No image posts found in r/${subreddit}`);
  }

  const post = posts[Math.floor(Math.random() * posts.length)];

  return fullRawBody
    ? post
    : {
        image: post.data.url,
        category: post.data.link_flair_text,
        caption: post.data.title,
        permalink: post.data.permalink,
      };
};

module.exports = reddit;
