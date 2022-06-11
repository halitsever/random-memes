const memes = require("../src/index");
test('Testing createMeme method...', async () => {
    let memecontent = {
        "toptext": "Hello",
        "bottomtext": "World",
        "getdataurl": true
    };
    let meme = await memes.createMeme("https://avatars.githubusercontent.com/u/34791459?v=4", memecontent);
    expect(

        meme.startsWith("data")

    ).toBe(true);
});