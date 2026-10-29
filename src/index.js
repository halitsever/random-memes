const random = require("./lib/random");
const reddit = require("./lib/reddit");

// A plain object literal lets Node detect named exports for ESM imports. A spread hides them.
module.exports = { random, reddit };
