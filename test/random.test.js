const memes = require('../src/index');

test('Testing random method...', async () => {
    expect(await memes.random()).toHaveProperty('image');
});

