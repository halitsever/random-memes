const { version } = require("../../package.json");

const USER_AGENT = `random-memes/${version} (+https://github.com/halitsever/random-memes)`;

const getJson = async (url) => {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    const error = new Error(`Request to ${url} failed with HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
};

module.exports = { getJson };
