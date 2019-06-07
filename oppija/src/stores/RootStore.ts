import { getEnv, Instance, types } from "mobx-state-tree"
import { EnvironmentStore } from "stores/EnvironmentStore"
import { IErrorStore } from "stores/ErrorStore"
import { HOKSStore } from "stores/HOKSStore"
import { NotificationStore } from "stores/NotificationStore"
import { OppilasStore } from "stores/OppilasStore"
import { SessionStore } from "stores/SessionStore"
import { TranslationStore } from "stores/TranslationStore"
import { TyopaikanToimijaStore } from "stores/TyopaikanToimijaStore"

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
  translations: types.optional(TranslationStore, {}),
  tyopaikanToimija: types.optional(TyopaikanToimijaStore, {})
}

export const RootStore = types
  .model("RootStore", RootStoreModel)
  .views(self => {
    return {
      get errors(): IErrorStore {
        return getEnv(self).errors
      }
    }
  })

export interface IRootStore extends Instance<typeof RootStore> {}
