import { getEnv, Instance, types } from "mobx-state-tree"
import { EnvironmentStore } from "stores/EnvironmentStore"
import { IErrorStore } from "stores/ErrorStore"
import { SessionStore } from "stores/SessionStore"
import { TranslationStore } from "stores/TranslationStore"

export interface InjectedStores {
  store: IRootStore
}

const RootStoreModel = {
  environment: types.optional(EnvironmentStore, {}),
  isLoading: false,
  session: types.optional(SessionStore, {}),
  translations: types.optional(TranslationStore, {})
}

export const RootStore = types
  .model("RootStore", RootStoreModel)
  .views(self => ({
    get errors(): IErrorStore {
      return getEnv(self).errors
    }
  }))

export type IRootStore = Instance<typeof RootStore>
