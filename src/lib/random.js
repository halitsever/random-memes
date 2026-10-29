const { getJson } = require("../utils/http");
const { isImageUrl } = require("../utils/image");

const SOURCES = [
  { instance: "https://lemmy.world", community: "memes" },
  { instance: "https://lemmy.world", community: "dankmemes" },
  { instance: "https://lemmy.ml", community: "memes" },
];

/** Hot listings change slowly, so one fetch serves calls for a while and spares the instances. */
const CACHE_TTL = 10 * 60 * 1000;

let pool;
let poolExpiresAt = 0;

const isUsable = ({ post, community }) =>
  isImageUrl(post.url) && !post.nsfw && !community.nsfw && !post.removed && !post.deleted && !post.featured_community && !post.featured_local;

const toMeme = ({ post, community }) => ({
  image: post.url,
  category: community.name,
  caption: post.name,
  permalink: post.ap_id,
});

const fetchSource = async ({ instance, community }) => {
  const { posts } = await getJson(`${instance}/api/v3/post/list?community_name=${community}&sort=Hot&limit=50`);
  return posts.filter(isUsable).map(toMeme);
};

const loadPool = async () => {
  const results = await Promise.allSettled(SOURCES.map(fetchSource));
  const failures = results.filter(({ status }) => status === "rejected").map(({ reason }) => reason);

  if (failures.length === SOURCES.length) {
    throw new Error("Failed to fetch memes from Lemmy", { cause: new AggregateError(failures, "Every source failed") });
  }

  // Cross-posts show up in several communities with the same image.
  const memes = new Map(results.flatMap(({ value = [] }) => value).map((meme) => [meme.image, meme]));

  if (memes.size === 0) {
    throw new Error("No image posts found on Lemmy");
  }

  return [...memes.values()];
};

const random = async () => {
  if (!pool || Date.now() >= poolExpiresAt) {
    const loading = loadPool();
    pool = loading;
    poolExpiresAt = Date.now() + CACHE_TTL;
    // Forget a failed load so the next call retries instead of replaying the error.
    loading.catch(() => {
      if (pool === loading) pool = undefined;
    });
  }

  const memes = await pool;
  return { ...memes[Math.floor(Math.random() * memes.length)] };
};

module.exports = random;
