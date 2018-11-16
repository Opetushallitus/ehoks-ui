// import kebabCase from "lodash.kebabcase"
import { getEnv, Instance, types } from "mobx-state-tree"
import { EducationProviderStore } from "stores/EducationProviderStore"
import { EnvironmentStore } from "stores/EnvironmentStore"
import { OppilasStore } from "stores/OppilasStore"
import { SessionStore } from "stores/SessionStore"
import { TranslationStore } from "stores/TranslationStore"
import { TyopaikanToimijaStore } from "stores/TyopaikanToimijaStore"

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
  education: types.optional(EducationProviderStore, { info: {} }),
  environment: types.optional(EnvironmentStore, {}),
  isLoading: false,
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
