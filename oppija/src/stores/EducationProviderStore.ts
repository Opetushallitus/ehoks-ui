import { apiUrl } from "config"
import { flow, getEnv, types } from "mobx-state-tree"
import {
  EducationProviderInfo,
  IEducationProviderInfo
} from "models/EducationProviderInfo"
import { ApiResponse } from "stores/RootStore"
import { StoreEnvironment } from "types/StoreEnvironment"

const EducationProviderModel = {
  info: types.optional(EducationProviderInfo, {}),
  isLoading: false
}

export const EducationProviderStore = types
  .model("EducationProviderStore", EducationProviderModel)
  .actions(self => {
    const { fetchSingle } = getEnv<StoreEnvironment>(self)

    const fetchInfo = flow(function*() {
      self.isLoading = true
      const response: ApiResponse<IEducationProviderInfo> = yield fetchSingle(
        apiUrl("education/info/")
      )
      self.info = response.data
      self.isLoading = false
    })

    return { fetchInfo }
  })
