import { flow, getEnv, types } from "mobx-state-tree"
import {
  EducationProviderInfo,
  IEducationProviderInfo
} from "models/EducationProviderInfo"
import { APIResponse } from "stores/types/APIResponse"
import { StoreEnvironment } from "types/StoreEnvironment"

const EducationProviderModel = {
  info: types.optional(EducationProviderInfo, {}),
  isLoading: false
}

export const EducationProviderStore = types
  .model("EducationProviderStore", EducationProviderModel)
  .actions(self => {
    const { fetchSingle, apiUrl } = getEnv<StoreEnvironment>(self)

    const fetchInfo = flow(function*() {
      self.isLoading = true
      const response: APIResponse<IEducationProviderInfo> = yield fetchSingle(
        apiUrl("education/info/")
      )
      self.info = response.data
      self.isLoading = false
    })

    return { fetchInfo }
  })
