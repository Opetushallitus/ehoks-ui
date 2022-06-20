import { getEnv, Instance, types } from "mobx-state-tree"
import { EnvironmentStore } from "./EnvironmentStore"
import { SessionStore } from "./SessionStore"
import { TranslationStore } from "stores/TranslationStore"
import { KoulutuksenJarjestajaStore } from "./KoulutuksenJarjestajaStore"
import { NotificationStore } from "./NotificationStore"
import { RaportitStore } from "./RaportitStore"

export interface InjectedStores {
  store: IRootStore
}

const RootStoreModel = {
  environment: types.optional(EnvironmentStore, {}),
  koulutuksenJarjestaja: types.optional(KoulutuksenJarjestajaStore, {}),
  session: types.optional(SessionStore, {}),
  translations: types.optional(TranslationStore, {}),
  notifications: types.optional(NotificationStore, {}),
  raportit: types.optional(RaportitStore, {})
}

export const RootStore = types
  .model("RootStore", RootStoreModel)
  .views(self => ({
    get errors() {
      return getEnv(self).errors
    }
  }))

export type IRootStore = Instance<typeof RootStore>
