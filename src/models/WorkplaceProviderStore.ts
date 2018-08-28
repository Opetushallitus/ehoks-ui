import { flow, getRoot, Instance, types } from "mobx-state-tree"
import { RootStore } from "models/RootStore"
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
      const response: Instance<
        typeof WorkplaceProviderInfo
      > = yield root.fetchSingle("http://localhost:3000/api/v1/work/info/")
      self.info = response
      self.isLoading = false
    })

    return { fetchInfo }
  })
