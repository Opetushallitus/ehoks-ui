# eHOKS frontend

Frontend repository for [eHOKS project](https://confluence.csc.fi/display/OPHPALV/eHOKS+-+hanke).

## Getting started

`npm install` installs required npm dependencies for `oppija` and `virkailija`

`npm start --prefix oppija` or `npm start --prefix virkailija` will run the specified subdirectory's `start`-script

`npm run styleguide` launches [react-styleguidist](https://react-styleguidist.js.org/) styleguide server in [localhost:6060](http://localhost:6060/)

## Dependencies and directory structure

There are two frontend apps included in the repository:

`oppija` directory includes views for students and workplace instructors, it will be hosted at e.g. `https://testiopintopolku.fi/ehoks/`

`virkailija` directory includes eHOKS views for education providers, it will be visible in Opintopolku's `virkailija` UI, e.g. `https://virkailija.testiopintopolku.fi`

Running `npm install` in repository's root level will install dependencies for both `oppija` and `virkailija` apps. There's also `shared` directory that includes styled-components theme and UI components that are used by both apps.

See `README` files in [oppija](oppija/README.md) and [virkailija](virkailija/README.md) directories for app specific instructions.

## Technologies used

- [React](https://facebook.github.io/react/) for rendering views
- [mobx-state-tree](https://github.com/mobxjs/mobx-state-tree) for state handling
- [Jest](https://facebook.github.io/jest/) for tests
- [TypeScript](https://www.typescriptlang.org) to provide type safety and ease maintenance & refactoring
- [Webpack](https://webpack.js.org) for building the JS bundle

See [TECHNICAL_DECISIONS.md](TECHNICAL_DECISIONS.md) document for more in-depth overview of the frontend architecture.
