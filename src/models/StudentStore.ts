import { flow, getRoot, Instance, types } from "mobx-state-tree"
import { RootActions } from "models/RootStore"
import { StudentInfo } from "models/StudentInfo"

const StudentStoreModel = {
  info: types.optional(StudentInfo, {}),
  isLoading: false
}

export const StudentStore = types
  .model("StudentStore", StudentStoreModel)
  .actions(self => {
    const root = getRoot<RootActions>(self)

    const fetchInfo = flow(function*() {
      self.isLoading = true
      const response: Instance<typeof StudentInfo> = yield root.fetchSingle(
        "http://localhost:3000/api/v1/student/info/"
      )
      self.info = response
      self.isLoading = false
    })

    return { fetchInfo }
  })
