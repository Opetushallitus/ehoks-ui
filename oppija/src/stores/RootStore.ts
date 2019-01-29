// import kebabCase from "lodash.kebabcase"
import { getEnv, Instance, types } from "mobx-state-tree"
import { EnvironmentStore } from "stores/EnvironmentStore"
import { HOKSStore } from "stores/HOKSStore"
import { OppilasStore } from "stores/OppilasStore"
import { SessionStore } from "stores/SessionStore"
import { TranslationStore } from "stores/TranslationStore"
import { TyopaikanToimijaStore } from "stores/TyopaikanToimijaStore"
import { KoulutuksenJarjestajaStore } from "./KoulutuksenJarjestajaStore"

export interface ApiResponse<T> {
  meta: {
    [name: string]: any
  }
  data: T
}

export interface InjectedStores {
  store: IRootStore
}

const RootStoreModel = {
  environment: types.optional(EnvironmentStore, {}),
  hoks: types.optional(HOKSStore, {}),
  isLoading: false,
  koulutuksenJarjestaja: types.optional(KoulutuksenJarjestajaStore, {}),
  oppilas: types.optional(OppilasStore, {}),
  session: types.optional(SessionStore, {}),
  translations: types.optional(TranslationStore, {}),
  tyopaikanToimija: types.optional(TyopaikanToimijaStore, {})
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
