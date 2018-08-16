import { flow, getEnv, types } from "mobx-state-tree"
import { mockFetch } from "../utils"
import { LearningPeriod } from "./LearningPeriod"

const RootStoreModel = {
  isLoading: false,
  learningPeriods: types.optional(types.array(LearningPeriod), [])
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
    const fetchLearningPeriods = flow(function*() {
      self.isLoading = true
      // const response = yield self.fetch(
      //   "https://api.github.com/repos/facebook/react/stargazers"
      // )
      // TODO: use real fetch & API endpoint
      const response = yield mockFetch("learningPeriods.json")
      self.learningPeriods = response
      self.isLoading = false
    })

    return { fetchLearningPeriods }
  })
