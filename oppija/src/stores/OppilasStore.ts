import { flow, getEnv, types } from "mobx-state-tree"
import { Peruste } from "models/Peruste"
import { APIResponse } from "types/APIResponse"
import { StoreEnvironment } from "types/StoreEnvironment"

const OppilasStoreModel = {
  isLoading: false,
  perusteet: types.optional(types.array(Peruste), [])
}

export const OppilasStore = types
  .model("OppilasStore", OppilasStoreModel)
  .actions(self => {
    const { apiUrl, fetchCollection, errors } = getEnv<StoreEnvironment>(self)
    // tracks the most recent fetch by user
    let newestPromise = null

    const haePerusteet = flow(function*(name: string): any {
      self.isLoading = true
      try {
        const fetchPromise: Promise<APIResponse> = fetchCollection(
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
