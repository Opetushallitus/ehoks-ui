import { apiUrl } from "config"
import { flow, getRoot, Instance, types } from "mobx-state-tree"
import { EducationProviderInfo } from "models/EducationProviderInfo"
import { ApiResponse, RootStore } from "models/RootStore"

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
      const response: ApiResponse<
        Instance<typeof EducationProviderInfo>
      > = yield root.fetchSingle(apiUrl("education/info/"))
      self.info = response.data
      self.isLoading = false
    })

    return { fetchInfo }
  })
