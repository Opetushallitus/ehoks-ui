import { flow, getEnv, getPropertyMembers, types } from "mobx-state-tree"
import { StoreEnvironment } from "types/StoreEnvironment"
import { APIResponse } from "types/APIResponse"

interface DynamicObject {
  [name: string]: any
}

// dumb cache for preventing multiple fetches for the same koodi-uri's
const cachedResponses: DynamicObject = {}

export const EnrichTutkinnonOsaKoodiUri = types
  .model({})
  // we need this typing to avoid 'missing index signature' error
  // when assigning to self[dynamicKey]
  .volatile((): DynamicObject => ({}))
  .actions(self => {
    const { apiUrl, apiPrefix, errors, fetchSingle, callerId } = getEnv<
      StoreEnvironment
    >(self)

    const fieldDoesntExist = (dynamicKey: string) =>
      Object.keys(self).indexOf(dynamicKey) < 0

    function logMissingFieldError(dynamicKey: string) {
      const { name } = getPropertyMembers(self)
      errors.logError(
        "EnrichKoodiUri.fetchEPerusteet",
        `Your mobx-state-tree model '${name}' is missing definition for '${dynamicKey}'`
      )
    }

    const getFromEPerusteetService = (code: string) =>
      fetchSingle(apiUrl(`${apiPrefix}/external/eperusteet/${code}`), {
        headers: callerId()
      })

    const fetchEPerusteet = flow(function*(
      enrichedField: string,
      koodiUri: string
    ): any {
      try {
        if (fieldDoesntExist(enrichedField)) {
          logMissingFieldError(enrichedField)
          return
        }

        // check our global cache first
        cachedResponses[koodiUri] =
          cachedResponses[koodiUri] || getFromEPerusteetService(koodiUri)
        const response: APIResponse = yield cachedResponses[koodiUri]
        self[enrichedField] = response.data
      } catch (error) {
        errors.logError("EnrichKoodiUri.fetchEPerusteet", error.message)
      }
    })

    const afterCreate = () => {
      fetchEPerusteet("tutkinnonOsa", self.tutkinnonOsaKoodiUri)
    }

    return { afterCreate }
  })
