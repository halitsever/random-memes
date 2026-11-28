---
title: "Build a Discord Meme Bot in Node.js"
titleTemplate: false
description: "Build a Discord meme bot in Node.js with discord.js and random-memes: a /meme slash command that posts a random meme as an embed, no meme API key."
date: 2026-11-28
faq:
  - q: "How do I make a meme bot for Discord?"
    a: "Create an application in the Discord Developer Portal, add a bot, and invite it with the applications.commands scope. Then register a /meme slash command and answer it with a random meme from the random-memes package, using discord.js."
  - q: "Do I need a meme API key?"
    a: "No. random-memes reads public Lemmy meme communities, which need no key or account. You only need your Discord bot token."
  - q: "Which intents does a slash-command meme bot need?"
    a: "Only Guilds. Slash commands arrive as interactions, so the bot does not need the privileged Message Content intent."
  - q: "Does the bot post NSFW memes?"
    a: "random-memes skips posts marked NSFW, posts from NSFW communities, and removed, deleted and pinned posts. The remaining memes are what people post to the communities, so they can still be crude."
---

# Build a Discord meme bot in Node.js

<p class="post-meta">Halit Sever · 28 November 2026</p>

This post builds a Discord bot with one slash command, `/meme`, that replies with a random meme: the image, its caption and a link to the original post. It uses [discord.js](https://discord.js.org) (version 14.28.1 at the time of writing) for Discord and [random-memes](/) for the memes. No meme API key is involved; the only secret is your bot token.

## What you need

- Node.js 20 or newer (random-memes requires 20+)
- A Discord account and a server where you can add bots

## 1. Create the bot

1. Open the [Discord Developer Portal](https://discord.com/developers/applications) and create an application.
2. On the **Bot** page, copy the token. Keep it out of git.
3. Note the **Application ID** on the **General Information** page.
4. Invite the bot with an OAuth2 URL that has the `bot` and `applications.commands` scopes.

## 2. Install

```bash
mkdir meme-bot && cd meme-bot
npm init -y
npm install discord.js random-memes
```

## 3. Register the /meme command

Slash commands are registered once, through Discord's REST API. `register.js`:

```javascript
const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [new SlashCommandBuilder().setName("meme").setDescription("Post a random meme").toJSON()];

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

rest
  .put(Routes.applicationCommands(process.env.DISCORD_APP_ID), { body: commands })
  .then(() => console.log("Registered /meme"))
  .catch(console.error);
```

```bash
DISCORD_TOKEN=... DISCORD_APP_ID=... node register.js
```

Global commands can take a while to show up in every server. While testing, `Routes.applicationGuildCommands(appId, guildId)` registers the command in one server only.

## 4. Answer it

`bot.js`:

```javascript
const { Client, EmbedBuilder, Events, GatewayIntentBits } = require("discord.js");
const { random } = require("random-memes");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (c) => console.log(`Logged in as ${c.user.tag}`));

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand() || interaction.commandName !== "meme") return;

  // Lemmy can take a moment on the first call, and Discord wants an answer within 3 seconds.
  await interaction.deferReply();
  try {
    const { image, caption, category, permalink } = await random();
    const embed = new EmbedBuilder()
      .setTitle(caption.slice(0, 256))
      .setURL(permalink)
      .setImage(image)
      .setFooter({ text: `c/${category} on Lemmy` });
    await interaction.editReply({ embeds: [embed] });
  } catch {
    await interaction.editReply("Couldn't reach the meme communities right now. Try again in a minute.");
  }
});

client.login(process.env.DISCORD_TOKEN);
```

```bash
DISCORD_TOKEN=... node bot.js
```

Type `/meme` in your server and the bot replies with an embed: the caption as a link to the post, the meme as the image, and the community in the footer.

## Why it is built this way

- **`deferReply()` first.** Discord expects an interaction to be acknowledged within 3 seconds. The first `random()` call fetches three Lemmy communities and can take longer than that, so the bot acknowledges first and edits the reply when the meme is ready.
- **Only the `Guilds` intent.** Slash commands arrive as interactions, so the bot never needs to read messages and does not need the privileged Message Content intent.
- **`caption.slice(0, 256)`.** Embed titles are limited to 256 characters, and Lemmy post titles can be longer.
- **A caught error.** `random()` rejects when every community is unreachable. The bot says so instead of leaving the interaction hanging.

## How fresh are the memes?

random-memes fetches up to 50 hot posts from each community and keeps the list in memory for 10 minutes. Calls within that window pick from the same list without new requests, which keeps the bot fast and spares the Lemmy instances. After 10 minutes, the next call fetches a fresh list. Restarting the bot clears the cache. Details are on the [random()](/random) page.

## FAQ

<Faq />

## Related

- [Random memes in the terminal](/blog/random-memes-cli): the same memes with `npx`
- [Filter NSFW posts from Lemmy](/blog/lemmy-nsfw-filter): what the package leaves out
- [Meme API as JSON](/meme-api): serve memes over HTTP instead
- [Random meme](/random-meme/): see what the bot will post
