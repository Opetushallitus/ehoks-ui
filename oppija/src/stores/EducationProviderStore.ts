import { flow, getEnv, types } from "mobx-state-tree"
import {
  EducationProviderInfo,
  IEducationProviderInfo
} from "models/EducationProviderInfo"
import { APIResponse } from "types/APIResponse"
import { StoreEnvironment } from "types/StoreEnvironment"

const EducationProviderModel = {
  info: types.optional(EducationProviderInfo, {}),
  isLoading: false
}

export const EducationProviderStore = types
  .model("EducationProviderStore", EducationProviderModel)
  .actions(self => {
    const { fetchSingle, apiUrl, appendCallerId } = getEnv<StoreEnvironment>(
      self
    )

    const fetchInfo = flow(function*(): any {
      self.isLoading = true
      const response: APIResponse<IEducationProviderInfo> = yield fetchSingle(
        apiUrl("education/info/"),
        { headers: appendCallerId() }
      )
      self.info = response.data
      self.isLoading = false
    })

    return { fetchInfo }
  })
