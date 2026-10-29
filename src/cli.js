#!/usr/bin/env node
const { parseArgs } = require("node:util");
const { random } = require("./index");

const HELP = `Usage: random-memes [options]

Prints a random meme's caption, image URL and post link.

Options:
  --json      Print the meme as JSON
  -h, --help  Show this help`;

const main = async () => {
  const { values } = parseArgs({
    options: {
      json: { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
    },
  });

  if (values.help) {
    console.log(HELP);
    return;
  }

  const meme = await random();
  console.log(values.json ? JSON.stringify(meme, null, 2) : `${meme.caption}\n${meme.image}\n${meme.permalink}`);
};

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
