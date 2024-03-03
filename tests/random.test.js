const random = require("../src/lib/random");

describe("random method test", () => {
  it("should return a random meme", async () => {
    const meme = await random();

    expect(meme).toHaveProperty("image");
    expect(meme).toHaveProperty("category");
    expect(meme).toHaveProperty("caption");
  });
});
