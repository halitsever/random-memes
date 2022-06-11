const memes = require("../src/index");
test('Testing createDuoMeme method...', async () => {
    let memecontent = {
        photo1: "https://avatars.githubusercontent.com/u/34791459?v=4",
        "photo1-x": 280,
        "photo1-y": 90,
        photo2: "https://avatars.githubusercontent.com/u/34791459?v=4",
        "photo2-x": 210,
        "photo2-y": 60,
        "getdataurl": true,
        pictureheight: 500,
        picturewidth:500
        };
    let meme = await memes.createMeme("https://avatars.githubusercontent.com/u/34791459?v=4", memecontent);
    expect(

        meme.startsWith("data")

    ).toBe(true);
});