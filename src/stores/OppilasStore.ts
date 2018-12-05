import { apiUrl } from "config"
import { flow, getEnv, types } from "mobx-state-tree"
import { Peruste } from "models/Peruste"
import { IStoreEnvironment } from "utils"

const OppilasStoreModel = {
  isLoading: false,
  perusteet: types.optional(types.array(Peruste), [])
}

export const OppilasStore = types
  .model("OppilasStore", OppilasStoreModel)
  .actions(self => {
    const { fetchCollection, errors } = getEnv<IStoreEnvironment>(self)
    // tracks the most recent fetch by user
    let newestPromise = null

    const haePerusteet = flow(function*(name: string) {
      self.isLoading = true
      try {
        const fetchPromise = fetchCollection(
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
        errors.logError("OppilasStore.haePerusteet", error.message)
        self.isLoading = false
      }
    })

    const tyhjennaPerusteet = () => {
      self.perusteet.clear()
    }

    return { haePerusteet, tyhjennaPerusteet }
  })
