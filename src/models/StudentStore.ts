import { apiUrl } from "config"
import { flow, getRoot, Instance, types } from "mobx-state-tree"
import { ApiResponse, RootStore } from "models/RootStore"
import { StudentInfo } from "models/StudentInfo"

const StudentStoreModel = {
  info: types.optional(StudentInfo, {}),
  isLoading: false
}

export const StudentStore = types
  .model("StudentStore", StudentStoreModel)
  .actions(self => {
    const root = getRoot<Instance<typeof RootStore>>(self)

    const fetchInfo = flow(function*(): any {
      self.isLoading = true
      const response: ApiResponse<
        Instance<typeof StudentInfo>
      > = yield root.fetchSingle(apiUrl("student/info/"))
      self.info = response.data
      self.isLoading = false
    })

    return { fetchInfo }
  })
