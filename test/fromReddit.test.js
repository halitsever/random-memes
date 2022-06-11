const memes = require('../src/index');

test('Testing fromReddit method...', async () => {
    expect(await memes.fromReddit()).toHaveProperty('image');
});


test('Testing fromReddit method with locale paramater...', async () => {
    expect(await memes.fromReddit("tr")).toHaveProperty('image');
});

