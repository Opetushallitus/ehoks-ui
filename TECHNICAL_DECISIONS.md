# Technical decisions

This document should shed light over some technical decisions taken in this project, feel free to add more sections if you figure out something that was initially unclear for you.

## State handling

`mobx-state-tree` was chosen over `redux` for reduced boilerplate, included run-time type system and validation for data models plus better built-in async support.

### mobx-state-tree

#### Actions

You can only mutate state using actions defined inside `types.model(..).actions()` .

Asynchronous actions should use `flow` method with generator function `function()* { ... }` , you can't use `async/await` because it's transpiled to ES5 in such a way that `mobx-state-tree` can't currently hook to it.

#### Model vs Store

Models that live inside `src/models` are just plain model interfaces, they usually have `views` methods for computed properties but they rarely should have any `actions` . There are exceptions though, e.g. HOKS model.

Stores are located at `src/stores` , they're collections of models and instances of other stores. They can also include `actions` that modify the store's state.

#### Types

You should define model types using `types` import from `mobx-state-tree` . See full list of types at [mobx-state-tree's Github repository](https://github.com/mobxjs/mobx-state-tree#types-overview).

Use `types.optional` with default value as much as possible, it makes testing the stores much easier as you can bootstrap the tree with empty models.

#### TypeScript

You can get the TypeScript typings for your model / store using `Instance<typeof Model>` and `SnapshotOrInstance<typeof Model>` , use it instead of writing separate typings for TypeScript. For convention I-prefixed naming is used for and only model / store interfaces.

With `@inject("store")` you need to set store as optional property: `store?: IRootStore` and mark it as always defined with exclamation mark `this.props.store!` .

Use TypeScript utility types like [Pick](https://www.typescriptlang.org/docs/handbook/utility-types.html) and [Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html) to construct correct interface from the model typings for your component. Do not just use all properties as optionally - if all are not used.

Many `flow` functions in stores are currently cluttered with `any` return values, this is because generator return values were changed in `TypeScript 3.6` and `mobx-state-tree` still hasn't fixed the typings, [see this issue for details](https://github.com/mobxjs/mobx-state-tree/issues/1378).

## Styles

Styles are defined within React components using CSS-in-JS library called [styled-components](https://www.styled-components.com/). Global styles can be added to `src/components/App/globalStyles.ts` , but try to keep all component specific styles away from global styles.

## Usage of new React features

### Context API

React's Context API is used for several features as it provides easy way to provide reactive values through deep React trees without explicitly passing props through several components.

`APIConfigContext` is used for providing current app's `apiUrl` and `apiPrefix` values for shared components, such as `ShareDialog` .

`AppContext` is used for providing current app name ( `oppija` or `virkailija` ) and feature flags to shared components.

`HOKSEidContext` is used for providing HOKS eid to `ShareDialog` .

### Hooks

`ShareDialog` uses React hooks extensively but they're not used elsewhere yet.

## Tests

This project uses [Jest](https://jestjs.io/) testing framework with [react-testing-library](https://github.com/kentcdodds/react-testing-library).

* Try to write tests that use your components like a real user would use them.
* Try to use `data-testid` s as your element identifiers as much as possible instead of matching by `classNames` or by text strings.
* Try to test your component's main functionality, not implementation details. Your tests should still work after you change styles, button texts or rearrange the DOM elements.

