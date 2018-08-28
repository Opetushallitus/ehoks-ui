import { flow, getRoot, types } from "mobx-state-tree"
import { EducationProviderInfo } from "models/EducationProviderInfo"

const EducationProviderModel = {
  info: types.optional(EducationProviderInfo, {}),
  isLoading: false
}

export const EducationProviderStore = types
  .model("EducationProviderStore", EducationProviderModel)
  .actions(self => {
    // TODO: proper RootStore typing, for now cast to any,
    // getRoot<typeof RootStore> creates circular reference when used with flow generator function
    const root: any = getRoot(self)

    const fetchInfo = flow(function*() {
      self.isLoading = true
      const response = yield root.fetchSingle(
        "http://localhost:3000/api/v1/education/info/"
      )
      self.info = response
      self.isLoading = false
    })

    return { fetchInfo }
  })
