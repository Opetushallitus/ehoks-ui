import { getEnv, Instance, types } from "mobx-state-tree"
import { EnvironmentStore } from "stores/EnvironmentStore"
import { IErrorStore } from "stores/ErrorStore"
import { HOKSStore } from "stores/HOKSStore"
import { NotificationStore } from "stores/NotificationStore"
import { OppilasStore } from "stores/OppilasStore"
import { SessionStore } from "stores/SessionStore"
import { ShareLinkStore } from "stores/ShareLinkStore"
import { TranslationStore } from "stores/TranslationStore"

export interface InjectedStores {
  store: IRootStore
}

const RootStoreModel = {
  environment: types.optional(EnvironmentStore, {}),
  hoks: types.optional(HOKSStore, {}),
  isLoading: false,
  notifications: types.optional(NotificationStore, {}),
  oppilas: types.optional(OppilasStore, {}),
  session: types.optional(SessionStore, {}),
  shareLinks: types.optional(ShareLinkStore, {}),
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
