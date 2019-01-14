# eHOKS frontend

Frontend repository for [eHOKS project](https://confluence.csc.fi/display/OPHPALV/eHOKS+-+hanke).

## Getting started

`npm install` installs required npm dependencies for `oppija` and `virkailija`

`npm run styleguide` launches [react-styleguidist](https://react-styleguidist.js.org/) styleguide server in [localhost:6060](http://localhost:6060/)

## Dependencies and directory structure

There are two frontend apps included in the repository:

`oppija` directory includes views for students and workplace instructors, it will be hosted at e.g. `https://testiopintopolku.fi/ehoks/`

`virkailija` directory includes eHOKS views for education providers, it will be visible in Opintopolku's `virkailija` UI, e.g. `https://virkailija.testiopintopolku.fi`

Running `npm install` in repository's root level will install dependencies for both `oppija` and `virkailija` apps. There's also `shared` directory that includes styled-components theme and UI components that are used by both apps.
