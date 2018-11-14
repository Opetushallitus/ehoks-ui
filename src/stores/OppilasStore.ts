import { apiUrl } from "config"
import { flow, getRoot, types } from "mobx-state-tree"
import { Peruste } from "models/Peruste"
import { IRootStore } from "stores/RootStore"

const OppilasStoreModel = {
  isLoading: false,
  perusteet: types.optional(types.array(Peruste), [])
}

export const OppilasStore = types
  .model("OppilasStore", OppilasStoreModel)
  .actions(self => {
    const root = getRoot<IRootStore>(self)
    // tracks the most recent fetch by user
    let newestPromise = null

    const haePerusteet = flow(function*(name: string): any {
      self.isLoading = true
      try {
        const fetchPromise = root.fetchCollection(
          apiUrl(`external/eperusteet/?nimi=${name}`)
        )
        newestPromise = fetchPromise
        const response = yield fetchPromise
        // react only to most recent search by user
        if (newestPromise === fetchPromise) {
          self.perusteet = response.data
          self.isLoading = false
        }
      } catch (error) {
        root.errors.logError(
          "OppilasStore.haePerusteet",
          "Ammatillisten tutkintojen haku epäonnistui",
          error.message
        )
        self.isLoading = false
      }
    })

    const tyhjennaPerusteet = () => {
      self.perusteet.clear()
    }

    return { haePerusteet, tyhjennaPerusteet }
  })
