import camelCase from "lodash.camelcase"
// import kebabCase from "lodash.kebabcase"
import mapObj from "map-obj"
import { flow, getEnv, Instance, types } from "mobx-state-tree"
import { LearningPeriod } from "models/LearningPeriod"
import { EducationProviderStore } from "stores/EducationProviderStore"
import { SessionStore } from "stores/SessionStore"
import { StudentStore } from "stores/StudentStore"
import { WorkplaceProviderStore } from "stores/WorkplaceProviderStore"

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
  activeLocale: types.optional(
    types.union(types.literal("fi"), types.literal("sv")),
    "fi"
  ),
  education: types.optional(EducationProviderStore, { info: {} }),
  isLoading: false,
  learningPeriods: types.optional(types.array(LearningPeriod), []),
  session: types.optional(SessionStore, {}),
  student: types.optional(StudentStore, { info: {} }),
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
        return mapObj(
          model,
          (key: string, value: any) => [camelCase(key), value],
          {
            deep: true
          }
        )
      }
    )

    const fetchCollection = flow(function*(url: string) {
      const response = yield self.fetch(url)
      const json = yield response.json()
      const model = json.data ? json.data : []
      return model
    })

    const deleteResource = flow(function*(url: string) {
      const response = yield self.fetch(url, { method: "DELETE" })
      const json = yield response.json()
      const model = json.data ? json.data : []
      return model
    })

    return { fetchSingle, fetchCollection, deleteResource }
  })
