import { flow, getRoot, Instance, types } from "mobx-state-tree"
import { EducationProviderInfo } from "models/EducationProviderInfo"
import { RootStore } from "models/RootStore"

const EducationProviderModel = {
  info: types.optional(EducationProviderInfo, {}),
  isLoading: false
}

export const EducationProviderStore = types
  .model("EducationProviderStore", EducationProviderModel)
  .actions(self => {
    const root = getRoot<Instance<typeof RootStore>>(self)

    const fetchInfo = flow(function*(): any {
      self.isLoading = true
      const response: Instance<
        typeof EducationProviderInfo
      > = yield root.fetchSingle("http://localhost:3000/api/v1/education/info/")
      self.info = response
      self.isLoading = false
    })

    return { fetchInfo }
  })
