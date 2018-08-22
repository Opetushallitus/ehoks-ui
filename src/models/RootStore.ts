import camelCase from "lodash.camelcase"
// import kebabCase from "lodash.kebabcase"
import mapObj from "map-obj"
import { flow, getEnv, types } from "mobx-state-tree"
import { StudentStore } from "models/StudentStore"
import { LearningPeriod } from "./LearningPeriod"

const RootStoreModel = {
  activeLocale: types.optional(
    types.union(types.literal("fi"), types.literal("sv")),
    "fi"
  ),
  isLoading: false,
  learningPeriods: types.optional(types.array(LearningPeriod), []),
  student: types.optional(StudentStore, { info: {} })
}

export const RootStore = types
  .model("RootStore", RootStoreModel)
  .views(self => ({
    // views defined here should be used from other stores using: getRoot(self)
    get fetch() {
      return getEnv(self).fetch
    }
  }))
  .views(self => {
    const fetchSingle = flow(function*(url: string) {
      const response = yield self.fetch(url)
      const model = response.data && response.data[0] ? response.data[0] : {}
      // camelCase kebab-cased object keys recursively so we can use dot syntax for accessing values
      return mapObj(
        model,
        (key: string, value: any) => [camelCase(key), value],
        {
          deep: true
        }
      )
    })

    const fetchCollection = flow(function*(url: string) {
      const response = yield self.fetch(url)
      console.log("fetchCollection", response)
      const model = response.data ? response.data : []
      return model
    })

    return { fetchSingle, fetchCollection }
  })
  .actions(_ => {
    // TODO
    return {}
  })
