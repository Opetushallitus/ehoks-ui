import { getEnv, Instance, types } from "mobx-state-tree"
import { EnvironmentStore } from "stores/EnvironmentStore"
import { HOKSStore } from "stores/HOKSStore"
import { TranslationStore } from "stores/TranslationStore"
import { KoulutuksenJarjestajaStore } from "./KoulutuksenJarjestajaStore"

export interface InjectedStores {
  store: IRootStore
}

const RootStoreModel = {
  environment: types.optional(EnvironmentStore, {}),
  hoks: types.optional(HOKSStore, {}),
  koulutuksenJarjestaja: types.optional(KoulutuksenJarjestajaStore, {}),
  translations: types.optional(TranslationStore, {})
}

export const RootStore = types
  .model("RootStore", RootStoreModel)
  .views(self => {
    return {
      get errors() {
        return getEnv(self).errors
      }
    }
  })

export interface IRootStore extends Instance<typeof RootStore> {}
