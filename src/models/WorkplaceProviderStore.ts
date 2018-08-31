import { apiUrl } from "config"
import { flow, getRoot, Instance, types } from "mobx-state-tree"
import { ApiResponse, RootStore } from "models/RootStore"
import { WorkplaceProviderInfo } from "models/WorkplaceProviderInfo"

const WorkplaceProviderModel = {
  info: types.optional(WorkplaceProviderInfo, {}),
  isLoading: false
}

export const WorkplaceProviderStore = types
  .model("WorkplaceProviderStore", WorkplaceProviderModel)
  .actions(self => {
    const root = getRoot<Instance<typeof RootStore>>(self)

    const fetchInfo = flow(function*(): any {
      self.isLoading = true
      const response: ApiResponse<
        Instance<typeof WorkplaceProviderInfo>
      > = yield root.fetchSingle(apiUrl("work/info/"))
      self.info = response.data
      self.isLoading = false
    })

    return { fetchInfo }
  })
