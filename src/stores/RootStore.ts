import camelCase from "lodash.camelcase"
// import kebabCase from "lodash.kebabcase"
import mapObj from "map-obj"
import { flow, getEnv, Instance, types } from "mobx-state-tree"
import { LearningPeriod } from "models/LearningPeriod"
import { EducationProviderStore } from "stores/EducationProviderStore"
import { OppilasStore } from "stores/OppilasStore"
import { SessionStore } from "stores/SessionStore"
import { TranslationStore } from "stores/TranslationStore"
import { WorkplaceProviderStore } from "stores/WorkplaceProviderStore"

function camelCaseDeep(model: any) {
  return mapObj(model, (key: string, value: any) => [camelCase(key), value], {
    deep: true
  })
}

export interface ApiResponse<T> {
  meta: {
    [name: string]: any
  }
  data: T
}

export interface InjectedStores {
  store: Instance<typeof RootStore>
}

const RootStoreModel = {
  education: types.optional(EducationProviderStore, { info: {} }),
  isLoading: false,
  learningPeriods: types.optional(types.array(LearningPeriod), []),
  oppilas: types.optional(OppilasStore, {}),
  session: types.optional(SessionStore, {}),
  translations: types.optional(TranslationStore, {}),
  work: types.optional(WorkplaceProviderStore, { info: {} })
}

export const RootStore = types
  .model("RootStore", RootStoreModel)
  .views(self => ({
    // views defined here should be used from other stores using: getRoot(self)
    get fetch() {
      return getEnv(self).fetch
    }
  }))
  .actions(self => {
    const fetchSingle: (url: string, init?: RequestInit) => any = flow(
      function*(url: string, init?: RequestInit) {
        const response = yield self.fetch(url, init)
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        const json = yield response.json()
        const model = {
          data: json.data && json.data[0] ? json.data[0] : null,
          meta: json.meta
        }
        // camelCase kebab-cased object keys recursively so we can use dot syntax for accessing values
        return camelCaseDeep(model)
      }
    )

    const fetchCollection: (url: string, init?: RequestInit) => any = flow(
      function*(url: string, init?: RequestInit) {
        const response = yield self.fetch(url, init)
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        const json = yield response.json()
        const model = {
          data: (json.data ? json.data : []).map(camelCaseDeep),
          meta: json.meta || {}
        }
        return model
      }
    )

    const deleteResource = flow(function*(url: string) {
      const response = yield self.fetch(url, { method: "DELETE" })
      const json = yield response.json()
      const model = json.data ? json.data : []
      return model
    })

    return { fetchSingle, fetchCollection, deleteResource }
  })
