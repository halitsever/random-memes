import memes, { random, reddit, type Meme, type RedditMeme, type RedditPost } from "random-memes";

const meme: Meme = await random();
const viaDefault: Meme = await memes.random();

const redditMeme: RedditMeme = await reddit();
const localized: RedditMeme = await reddit({ locale: "tr", fullRawBody: false });
const raw: RedditPost = await reddit({ fullRawBody: true });

declare const flag: boolean;
const either: RedditMeme | RedditPost = await reddit({ fullRawBody: flag });

// @ts-expect-error unknown locale
await reddit({ locale: "xx" });

// @ts-expect-error raw posts are not RedditMeme
const wrong: RedditMeme = await reddit({ fullRawBody: true });

export { meme, viaDefault, redditMeme, localized, raw, either, wrong };
