# Contributing

Thanks for helping out. Bug reports and pull requests are both welcome.

## Reporting a bug

Open an [issue](https://github.com/halitsever/random-memes/issues/new/choose) with your random-memes and Node.js versions and the steps that trigger the problem. Security problems go by email instead, see [SECURITY.md](SECURITY.md).

## Development setup

Requires Node.js 20 or newer.

```bash
git clone https://github.com/halitsever/random-memes.git
cd random-memes
npm install
```

| Command | What it does |
|---|---|
| `npm test` | Runs the tests. They mock `fetch`, so they need no network. |
| `npm run test:types` | Type-checks `src/index.d.ts` against `tests/types/usage.mts` |
| `npm start` | Runs the CLI against the live Lemmy communities |
| `npm run docs:dev` | Serves the documentation site locally |

## Pull requests

1. Fork the repository and create a branch from `master`.
2. Add or update tests for the behavior you change. When the public API changes, update `src/index.d.ts` and the pages in `docs/` too.
3. Make sure `npm test` and `npm run test:types` pass. CI runs both on Node.js 20, 22 and 24.
4. Write commit messages in the [Conventional Commits](https://www.conventionalcommits.org) style, for example `fix: skip gallery posts`.
5. Open the pull request against `master` and fill in the template.

By contributing, you agree that your work is licensed under the [MIT License](LICENSE) and that you follow the [Code of Conduct](CODE_OF_CONDUCT.md).
