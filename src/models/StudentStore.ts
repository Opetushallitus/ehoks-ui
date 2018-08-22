import { flow, getRoot, types } from "mobx-state-tree"
import { StudentInfo } from "models/StudentInfo"

const StudentStoreModel = {
  info: types.optional(StudentInfo, {}),
  isLoading: false
}

export const StudentStore = types
  .model("StudentStore", StudentStoreModel)
  .actions(self => {
    // TODO: proper root typing, for now cast to any, getRoot<typeof RootStore> creates circular reference
    const root: any = getRoot(self)

    const fetchInfo = flow(function*() {
      self.isLoading = true
      const response = yield root.fetchSingle(
        "http://localhost:3000/api/v1/student/info/"
      )
      self.info = response
      self.isLoading = false
    })

    return { fetchInfo }
  })
