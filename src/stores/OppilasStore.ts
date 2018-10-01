import { apiUrl } from "config"
import { flow, getRoot, Instance, types } from "mobx-state-tree"
import { Peruste } from "models/Peruste"
import { RootStore } from "stores/RootStore"

const OppilasStoreModel = {
  isLoading: false,
  perusteet: types.optional(types.array(Peruste), [])
}

export const OppilasStore = types
  .model("OppilasStore", OppilasStoreModel)
  .actions(self => {
    const root = getRoot<Instance<typeof RootStore>>(self)

    const haePerusteet = flow(function*(name: string): any {
      self.isLoading = true
      const response = yield root.fetchCollection(
        apiUrl(`external/eperusteet/?nimi=${name}`)
      )
      self.perusteet = response.data
      self.isLoading = false
    })

    const tyhjennaPerusteet = () => {
      self.perusteet.clear()
    }

    return { haePerusteet, tyhjennaPerusteet }
  })
