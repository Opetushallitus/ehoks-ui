import { flow, getEnv, types } from "mobx-state-tree"
import { StoreEnvironment } from "types/StoreEnvironment"
import { APIResponse } from "types/APIResponse"

interface DynamicObject {
  [name: string]: any
}

// dumb cache for preventing multiple fetches for the same koodi-uri's
const cachedResponses: DynamicObject = {}

export const EnrichTutkinnonOsaAndOsaAlue = types
  .model({})
  // we need this typing to avoid 'missing index signature' error
  // when assigning to self[dynamicKey]
  .volatile((): DynamicObject => ({}))
  .actions(self => {
    const { apiUrl, apiPrefix, errors, fetchSingle, callerId } = getEnv<
      StoreEnvironment
    >(self)

    const getTutkinnonOsaFromEPerusteet = (code: string) =>
      fetchSingle(apiUrl(`${apiPrefix}/external/eperusteet/${code}`), {
        headers: callerId()
      })

    const fetchTutkinnonOsa = flow(function*(koodiUri: string): any {
      try {
        // check our global cache first
        cachedResponses[koodiUri] =
          cachedResponses[koodiUri] || getTutkinnonOsaFromEPerusteet(koodiUri)
        const response: APIResponse = yield cachedResponses[koodiUri]
        self.tutkinnonOsa = response.data
      } catch (error) {
        errors.logError("EnrichKoodiUri.fetchEPerusteet", error.message)
      }
    })

    const afterCreate = () => {
      fetchTutkinnonOsa(self.tutkinnonOsaKoodiUri)
    }

    return { afterCreate }
  })
