import { apiUrl } from "config"
import { flow, getEnv, types } from "mobx-state-tree"
import {
  IWorkplaceProviderInfo,
  WorkplaceProviderInfo
} from "models/WorkplaceProviderInfo"
import { ApiResponse } from "stores/RootStore"
import { IStoreEnvironment } from "utils"

const WorkplaceProviderModel = {
  info: types.optional(WorkplaceProviderInfo, {}),
  isLoading: false
}

export const WorkplaceProviderStore = types
  .model("WorkplaceProviderStore", WorkplaceProviderModel)
  .actions(self => {
    const { fetchSingle } = getEnv<IStoreEnvironment>(self)

    const fetchInfo = flow(function*(): any {
      self.isLoading = true
      const response: ApiResponse<IWorkplaceProviderInfo> = yield fetchSingle(
        apiUrl("work/info/")
      )
      self.info = response.data
      self.isLoading = false
    })

    return { fetchInfo }
  })
