const { test } = require("node:test");
const assert = require("node:assert/strict");
const reddit = require("../src/lib/reddit");
const { mockFetch, requestedUrl } = require("./helpers");

const post = (data) => ({
  kind: "t3",
  data: { stickied: false, title: "caption", link_flair_text: "flair", permalink: "/r/dankmemes/comments/abc/caption/", url: "https://i.redd.it/meme.png", ...data },
});

const listing = (...posts) => ({ data: { children: posts } });

// Runs first because the warning is emitted only once per process.
test("emits a deprecation warning only on the first call", async (t) => {
  mockFetch(t, listing(post()));
  const emitWarning = t.mock.method(process, "emitWarning", () => {});

  await reddit();
  await reddit();

  assert.equal(emitWarning.mock.callCount(), 1);
  assert.equal(emitWarning.mock.calls[0].arguments[1].type, "DeprecationWarning");
});

test("works without arguments and uses the English subreddit", async (t) => {
  const fetchMock = mockFetch(t, listing(post()));

  const meme = await reddit();

  assert.equal(requestedUrl(fetchMock), "https://www.reddit.com/r/dankmemes/hot.json?limit=100&raw_json=1");
  assert.deepEqual(meme, { image: "https://i.redd.it/meme.png", category: "flair", caption: "caption", permalink: "/r/dankmemes/comments/abc/caption/" });
});

test("uses the subreddit for the given locale", async (t) => {
  const fetchMock = mockFetch(t, listing(post()));

  await reddit({ locale: "tr" });

  assert.match(requestedUrl(fetchMock), /\/r\/burdurland\//);
});

test("prefers customSubredditName over locale", async (t) => {
  const fetchMock = mockFetch(t, listing(post()));

  await reddit({ locale: "tr", customSubredditName: "memes" });

  assert.match(requestedUrl(fetchMock), /\/r\/memes\//);
});

test("rejects an unknown locale without sending a request", async (t) => {
  const fetchMock = mockFetch(t, listing(post()));

  await assert.rejects(reddit({ locale: "xx" }), /Unknown locale "xx"/);
  assert.equal(fetchMock.mock.callCount(), 0);
});

test("skips stickied and non-image posts", async (t) => {
  const image = post({ url: "https://i.redd.it/keep.jpg" });
  mockFetch(t, listing(post({ stickied: true }), post({ url: "https://v.redd.it/video" }), post({ url: "https://www.reddit.com/gallery/abc" }), image));

  for (let i = 0; i < 10; i++) {
    assert.equal((await reddit()).image, "https://i.redd.it/keep.jpg");
  }
});

test("rejects when no image posts are left", async (t) => {
  mockFetch(t, listing(post({ stickied: true })));

  await assert.rejects(reddit(), /No image posts found in r\/dankmemes/);
});

test("explains a 403 from Reddit", async (t) => {
  mockFetch(t, {}, 403);

  await assert.rejects(reddit(), (error) => {
    assert.match(error.message, /blocks most unauthenticated requests/);
    assert.equal(error.cause.status, 403);
    return true;
  });
});

test("returns the raw post with fullRawBody", async (t) => {
  const raw = post();
  mockFetch(t, listing(raw));

  assert.deepEqual(await reddit({ fullRawBody: true }), raw);
});
