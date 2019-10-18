# figma-sass-less-plugin

> Generate SCSS or LESS from Figma document (Plugin)

Easily generate variables and mixins from Figma styles

What is supported:

|                 | SCSS | LESS | CSS |
| --------------- | :--: | :--: | :-: |
| color variables |  •   |  •   |  •  |
| text styles     |  •   |  •   |     |

## Contributing

### Setup

Install dependencies:

```bash
npm i
```

Start development environment:

```bash
npm start
```

Build the plugin for production:

```bash
npm run build
```

### Commit Style with [Commitizen](http://commitizen.github.io/cz-cli/)

To commit in this repository use `git-cz` (with `commitizen` installed globally) or `npm run commit` when committing.

You'll be prompted to fill in any required fields and your commit messages will be formatted according to the standards defined by project maintainers:

```bash
$ npm run commit

cz-cli@4.0.3, cz-conventional-changelog@3.0.2

? Select the type of change that you're committing: (Use arrow keys)
❯ feat:     A new feature
  fix:      A bug fix
  docs:     Documentation only changes
  style:    Changes that do not affect the meaning of the code (white-space, formatting, ...
  refactor: A code change that neither fixes a bug nor adds a feature
  perf:     A code change that improves performance
  test:     Adding missing tests or correcting existing tests
(Move up and down to reveal more choices)
```

### Releases & Changelog

To publish new version:

```bash
# update changelogs interactively
npm run changelog

# push commit and tags
npm run release
```

---
