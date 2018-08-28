import { flow, getRoot, types } from "mobx-state-tree"
import { WorkplaceProviderInfo } from "models/WorkplaceProviderInfo"

const WorkplaceProviderModel = {
  info: types.optional(WorkplaceProviderInfo, {}),
  isLoading: false
}

export const WorkplaceProviderStore = types
  .model("WorkplaceProviderStore", WorkplaceProviderModel)
  .actions(self => {
    // TODO: proper RootStore typing, for now cast to any,
    // getRoot<typeof RootStore> creates circular reference when used with flow generator function
    const root: any = getRoot(self)

    const fetchInfo = flow(function*() {
      self.isLoading = true
      const response = yield root.fetchSingle(
        "http://localhost:3000/api/v1/work/info/"
      )
      self.info = response
      self.isLoading = false
    })

    return { fetchInfo }
  })
