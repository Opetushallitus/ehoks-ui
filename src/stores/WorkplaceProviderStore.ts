import { apiUrl } from "config"
import { flow, getRoot, types } from "mobx-state-tree"
import {
  IWorkplaceProviderInfo,
  WorkplaceProviderInfo
} from "models/WorkplaceProviderInfo"
import { ApiResponse, IRootStore } from "stores/RootStore"

const WorkplaceProviderModel = {
  info: types.optional(WorkplaceProviderInfo, {}),
  isLoading: false
}

export const WorkplaceProviderStore = types
  .model("WorkplaceProviderStore", WorkplaceProviderModel)
  .actions(self => {
    const root = getRoot<IRootStore>(self)

    const fetchInfo = flow(function*(): any {
      self.isLoading = true
      const response: ApiResponse<
        IWorkplaceProviderInfo
      > = yield root.fetchSingle(apiUrl("work/info/"))
      self.info = response.data
      self.isLoading = false
    })

    return { fetchInfo }
  })
