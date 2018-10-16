import { apiUrl } from "config"
import { flow, getRoot, types } from "mobx-state-tree"
import {
  EducationProviderInfo,
  IEducationProviderInfo
} from "models/EducationProviderInfo"
import { ApiResponse, IRootStore } from "stores/RootStore"

const EducationProviderModel = {
  info: types.optional(EducationProviderInfo, {}),
  isLoading: false
}

export const EducationProviderStore = types
  .model("EducationProviderStore", EducationProviderModel)
  .actions(self => {
    const root = getRoot<IRootStore>(self)

    const fetchInfo = flow(function*(): any {
      self.isLoading = true
      const response: ApiResponse<
        IEducationProviderInfo
      > = yield root.fetchSingle(apiUrl("education/info/"))
      self.info = response.data
      self.isLoading = false
    })

    return { fetchInfo }
  })
