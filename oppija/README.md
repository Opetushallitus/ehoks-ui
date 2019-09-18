# eHOKS - student and workplace instructor views (oppija)

## Getting started

`npm start` starts the development server in [localhost:8080/ehoks](http://localhost:8080/ehoks)

`npm test` runs the Jest test suite

`npm run extract_translations` will parse all TypeScript source code for `<FormattedMessage />` components and extract their `id` & `defaultMessage` pairs to `translations.json`.

## Dependencies

Run `npm install` in repository's root to install all required dependencies, `DO NOT INSTALL` any dependencies to `oppija` directory.

## Technologies used

- [React](https://facebook.github.io/react/) for rendering views
- [mobx-state-tree](https://github.com/mobxjs/mobx-state-tree) for state handling
- [Jest](https://facebook.github.io/jest/) for tests
- [TypeScript](https://www.typescriptlang.org) to provide type safety and ease maintenance & refactoring
- [Webpack](https://webpack.js.org) for building the JS bundle
