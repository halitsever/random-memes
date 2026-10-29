const { test } = require("node:test");
const assert = require("node:assert/strict");
const { version } = require("../package.json");
const { jsonResponse } = require("./helpers");

/** Fresh module per test, so the cached pool never leaks between tests. */
const loadRandom = () => {
  delete require.cache[require.resolve("../src/lib/random")];
  return require("../src/lib/random");
};

const lemmyPost = (post = {}, community = {}) => ({
  post: {
    name: "caption",
    url: "https://lemmy.world/pictrs/image/meme.png",
    ap_id: "https://lemmy.world/post/1",
    nsfw: false,
    removed: false,
    deleted: false,
    featured_community: false,
    featured_local: false,
    ...post,
  },
  community: { name: "memes", nsfw: false, ...community },
});

/** Keys look like "lemmy.world/memes". A number answers with that HTTP status, a missing key with no posts. */
const lemmy = (sources) => async (url) => {
  const { host, searchParams } = new URL(url);
  const source = sources[`${host}/${searchParams.get("community_name")}`] ?? [];
  return typeof source === "number" ? jsonResponse({}, source) : jsonResponse({ posts: source });
};

const mockLemmy = (t, sources) => t.mock.method(globalThis, "fetch", lemmy(sources));

test("returns an image post as a meme", async (t) => {
  mockLemmy(t, { "lemmy.world/memes": [lemmyPost()] });

  assert.deepEqual(await loadRandom()(), {
    image: "https://lemmy.world/pictrs/image/meme.png",
    category: "memes",
    caption: "caption",
    permalink: "https://lemmy.world/post/1",
  });
});

test("reads the hot listing of every source with a package User-Agent", async (t) => {
  const fetchMock = mockLemmy(t, { "lemmy.world/memes": [lemmyPost()] });

  await loadRandom()();

  assert.deepEqual(fetchMock.mock.calls.map(({ arguments: [url] }) => url).sort(), [
    "https://lemmy.ml/api/v3/post/list?community_name=memes&sort=Hot&limit=50",
    "https://lemmy.world/api/v3/post/list?community_name=dankmemes&sort=Hot&limit=50",
    "https://lemmy.world/api/v3/post/list?community_name=memes&sort=Hot&limit=50",
  ]);
  assert.equal(fetchMock.mock.calls[0].arguments[1].headers["User-Agent"], `random-memes/${version} (+https://github.com/halitsever/random-memes)`);
});

test("skips pinned, NSFW, removed and non-image posts", async (t) => {
  const keep = "https://lemmy.world/pictrs/image/keep.jpeg";
  mockLemmy(t, {
    "lemmy.world/memes": [
      lemmyPost({ featured_community: true }),
      lemmyPost({ featured_local: true }),
      lemmyPost({ nsfw: true }),
      lemmyPost({}, { nsfw: true }),
      lemmyPost({ removed: true }),
      lemmyPost({ deleted: true }),
      lemmyPost({ url: null }),
      lemmyPost({ url: "https://example.com/article" }),
      lemmyPost({ url: keep }),
    ],
  });
  const random = loadRandom();

  for (let i = 0; i < 10; i++) {
    assert.equal((await random()).image, keep);
  }
});

test("drops cross-posted duplicates of the same image", async (t) => {
  mockLemmy(t, {
    "lemmy.world/memes": [lemmyPost({ url: "https://lemmy.world/pictrs/image/a.png" })],
    "lemmy.ml/memes": [lemmyPost({ url: "https://lemmy.world/pictrs/image/a.png" }), lemmyPost({ url: "https://lemmy.ml/pictrs/image/b.png" })],
  });
  // With the duplicate kept, index 1 of three entries would be a.png again.
  t.mock.method(Math, "random", () => 0.5);

  assert.equal((await loadRandom()()).image, "https://lemmy.ml/pictrs/image/b.png");
});

test("keeps working when some sources fail", async (t) => {
  mockLemmy(t, { "lemmy.world/memes": 500, "lemmy.world/dankmemes": [lemmyPost({}, { name: "dankmemes" })], "lemmy.ml/memes": 503 });

  assert.equal((await loadRandom()()).category, "dankmemes");
});

test("rejects with every failure as cause when all sources fail", async (t) => {
  mockLemmy(t, { "lemmy.world/memes": 500, "lemmy.world/dankmemes": 500, "lemmy.ml/memes": 500 });

  await assert.rejects(loadRandom()(), (error) => {
    assert.match(error.message, /Failed to fetch memes from Lemmy/);
    assert.deepEqual(
      error.cause.errors.map(({ status }) => status),
      [500, 500, 500],
    );
    return true;
  });
});

test("rejects when no source has an image post", async (t) => {
  mockLemmy(t, {});

  await assert.rejects(loadRandom()(), /No image posts found on Lemmy/);
});

test("reuses fetched posts for ten minutes", async (t) => {
  t.mock.timers.enable({ apis: ["Date"], now: 0 });
  const fetchMock = mockLemmy(t, { "lemmy.world/memes": [lemmyPost()] });
  const random = loadRandom();

  await random();
  await random();
  assert.equal(fetchMock.mock.callCount(), 3);

  t.mock.timers.tick(10 * 60 * 1000);
  await random();
  assert.equal(fetchMock.mock.callCount(), 6);
});

test("shares one fetch between concurrent calls", async (t) => {
  const fetchMock = mockLemmy(t, { "lemmy.world/memes": [lemmyPost()] });
  const random = loadRandom();

  await Promise.all([random(), random(), random()]);

  assert.equal(fetchMock.mock.callCount(), 3);
});

test("retries after a failed fetch", async (t) => {
  const fetchMock = mockLemmy(t, { "lemmy.world/memes": 500, "lemmy.world/dankmemes": 500, "lemmy.ml/memes": 500 });
  const random = loadRandom();

  await assert.rejects(random());
  fetchMock.mock.mockImplementation(lemmy({ "lemmy.world/memes": [lemmyPost()] }));

  assert.equal((await random()).category, "memes");
});
