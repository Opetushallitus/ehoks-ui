# Technical decisions

This document should shed light over some technical decisions taken in this project, feel free to add more sections if you
figure out something that was initially unclear for you.

## State handling

`mobx-state-tree` was chosen over `redux` for reduced boilerplate, included type system for data models and better built-in async support.

## mobx-state-tree

### Actions

You can only mutate state using actions defined inside `types.model(..).actions()`.

Asynchronous actions should use `flow` method with generator function `function()*: any { ... }`, you can't use `async/await` because it's transpiled in a way that `mobx-state-tree` can't hook to it.

Use generic methods from `RootStore` as much as possible, you can refer to `root` using e.g. `const root = getRoot<Instance<typeof RootStore>>(self)` inside child store's `.actions(self => ...)` function.

## Model vs Store

Models that live inside `src/models` are just plain model interfaces, they probably should not have any `actions`.

Stores are located at `src/stores`, they're collections of models and instances of other stores. They can also include `actions` that modify the store's state.

**NOTE** This separation of models and stores might still change as we encounter more usage scenarios.

### Types

You should define model types using `types` import from `mobx-state-tree`. See full list of types at [mobx-state-tree's Github repository](https://github.com/mobxjs/mobx-state-tree#types-overview).

Use `types.optional` with default value as much as possible, it makes testing the stores much easier.

### TypeScript

You can get the TypeScript typings for your model / store using `Instance<typeof Model>`, use it instead of writing separate typings for TypeScript.
