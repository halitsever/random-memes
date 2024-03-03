const reddit = require("../src/lib/reddit");

describe("random reddit method test", () => {
  it("should return a random meme from reddit", async () => {
    const meme = await reddit({ subreddit: "en" });

    expect(meme).toHaveProperty("image");
    expect(meme).toHaveProperty("category");
    expect(meme).toHaveProperty("caption");
  });
});
