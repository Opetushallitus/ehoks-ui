import { apiUrl } from "config"
import { flow, getRoot, Instance, types } from "mobx-state-tree"
import { tutkinnotMock, Tutkinto } from "models/Tutkinto"
import { RootStore } from "stores/RootStore"

const OppilasStoreModel = {
  isLoading: false,
  tutkinnot: types.optional(types.array(Tutkinto), [])
}

export const OppilasStore = types
  .model("OppilasStore", OppilasStoreModel)
  .actions(self => {
    const root = getRoot<Instance<typeof RootStore>>(self)

    const haeTutkinnot = flow(function*(): any {
      self.isLoading = true
      const response = yield root.fetchCollection(apiUrl("student/perusteet"))
      self.tutkinnot = response.data
      self.isLoading = false
    })

    const haeMockTutkinnot = flow(function*(): any {
      self.isLoading = true
      self.tutkinnot.replace(tutkinnotMock as Array<Instance<typeof Tutkinto>>)
      self.isLoading = false
    })
    return { haeTutkinnot, haeMockTutkinnot }
  })
