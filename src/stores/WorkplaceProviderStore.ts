import { apiUrl } from "config"
import { flow, getRoot, Instance, types } from "mobx-state-tree"
import { WorkplaceProviderInfo } from "models/WorkplaceProviderInfo"
import { ApiResponse, RootStore } from "stores/RootStore"

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
