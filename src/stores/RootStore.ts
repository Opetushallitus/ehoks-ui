// import kebabCase from "lodash.kebabcase"
import { Instance, types } from "mobx-state-tree"
import { EducationProviderStore } from "stores/EducationProviderStore"
import { EnvironmentStore } from "stores/EnvironmentStore"
import { OppilasStore } from "stores/OppilasStore"
import { SessionStore } from "stores/SessionStore"
import { TranslationStore } from "stores/TranslationStore"
import { WorkplaceProviderStore } from "stores/WorkplaceProviderStore"
import { ErrorStore } from "./ErrorStore"

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
  errors: types.optional(ErrorStore, {}),
  isLoading: false,
  oppilas: types.optional(OppilasStore, {}),
  session: types.optional(SessionStore, {}),
  translations: types.optional(TranslationStore, {}),
  work: types.optional(WorkplaceProviderStore, { info: {} })
}

export const RootStore = types.model("RootStore", RootStoreModel)

export interface IRootStore extends Instance<typeof RootStore> {}
