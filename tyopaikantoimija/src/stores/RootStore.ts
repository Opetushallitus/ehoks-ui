import { getEnv, Instance, types } from "mobx-state-tree"
import { EnvironmentStore } from "stores/EnvironmentStore"
import { IErrorStore } from "stores/ErrorStore"
import { SessionStore } from "stores/SessionStore"
import { TranslationStore } from "stores/TranslationStore"
import { ShareStore } from "stores/ShareStore"

export interface InjectedStores {
  store: IRootStore
}

const RootStoreModel = {
  environment: types.optional(EnvironmentStore, {}),
  isLoading: false,
  session: types.optional(SessionStore, {}),
  translations: types.optional(TranslationStore, {}),
  share: types.optional(ShareStore, {})
}

export const RootStore = types
  .model("RootStore", RootStoreModel)
  .views(self => ({
    get errors(): IErrorStore {
      return getEnv(self).errors
    }
  }))

export type IRootStore = Instance<typeof RootStore>
