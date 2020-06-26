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

    const getFromKoodistoService = (code: string) =>
      fetchSingle(apiUrl(`${apiPrefix}/external/eperusteet/${code}`), {
        headers: callerId()
      })

    const fetchEPerusteet = flow(function*(key: string, code: string): any {
      try {
        const [dynamicKey] = key.split("KoodiUri") // key without KoodiUri

        if (fieldDoesntExist(dynamicKey)) {
          logMissingFieldError(dynamicKey)
          return
        }

        // check our global cache first
        cachedResponses[code] =
          cachedResponses[code] || getFromKoodistoService(code)
        const response: APIResponse = yield cachedResponses[code]
        self[dynamicKey] = response.data
      } catch (error) {
        errors.logError("EnrichKoodiUri.fetchEPerusteet", error.message)
      }
    })

    const keyShouldBeEnrichedFromEperusteet = (key: string) =>
      key.match(/tutkinnonOsaKoodiUri/) && self[key]

    function getCodes(key: string) {
      const codes: string[] = Array.isArray(self[key]) ? self[key] : [self[key]]
      return codes
    }

    function enrichFromEperusteet(key: string) {
      const codes = getCodes(key)
      codes.forEach(code => {
        fetchEPerusteet(key, code)
      })
    }

    const afterCreate = () => {
      Object.keys(self).forEach(key => {
        if (keyShouldBeEnrichedFromEperusteet(key)) {
          enrichFromEperusteet(key)
          return
        }
      })
    }

    return { afterCreate }
  })
