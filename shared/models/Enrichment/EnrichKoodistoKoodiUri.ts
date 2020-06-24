import { flow, getEnv, getPropertyMembers, types } from "mobx-state-tree"
import { StoreEnvironment } from "../../types/StoreEnvironment"
import { APIResponse } from "../../types/APIResponse"

interface DynamicObject {
  [name: string]: any
}

// dumb cache for preventing multiple fetches for the same koodi-uri's
const cachedResponses: DynamicObject = {}

export const EnrichKoodistoKoodiUri = types
  .model({})
  // we need this typing to avoid 'missing index signature' error
  // when assigning to self[dynamicKey]
  .volatile((): DynamicObject => ({}))
  .actions(self => {
    const { apiUrl, apiPrefix, errors, fetchSingle, callerId } = getEnv<
      StoreEnvironment
    >(self)

    const fetchKoodisto = flow(function*(key: string, code: string): any {
      try {
        // check our global cache first
        cachedResponses[code] =
          cachedResponses[code] ||
          fetchSingle(apiUrl(`${apiPrefix}/external/koodisto/${code}`), {
            headers: callerId()
          })
        const { data }: APIResponse = yield cachedResponses[code]
        // we currently only need nimi from KoodistoKoodi
        if (Object.keys(self).indexOf(key) > -1) {
          self[key] = data.metadata.reduce((result: any, meta: any) => {
            result[meta.kieli.toLowerCase()] = meta
            return result
          }, {})
        } else {
          const { name } = getPropertyMembers(self)
          throw new Error(
            `Your mobx-state-tree model '${name}' is missing definition for '${key}'`
          )
        }
      } catch (error) {
        errors.logError("EnrichKoodiUri.fetchKoodisto", error.message)
      }
    })

    const keyShouldBeEnrichedFromKoodisto = (key: string) =>
      key.match(/KoodiUri/) && self[key]

    function getCodes(key: string) {
      const codes: string[] = Array.isArray(self[key]) ? self[key] : [self[key]]
      return codes
    }

    function enrichFromKoodisto(key: string) {
      const codes = getCodes(key)
      codes.forEach(code => {
        const [enrichedKey] = key.split("KoodiUri") // key without KoodiUri
        fetchKoodisto(enrichedKey, code)
      })
    }

    const enrichOsaAlueReference = (key: string) => key === "osaAlueData"

    const afterCreate = () => {
      Object.keys(self).forEach(key => {
        if (enrichOsaAlueReference(key)) {
          fetchKoodisto(key, self.koodiUri)
          return
        }

        if (keyShouldBeEnrichedFromKoodisto(key)) {
          enrichFromKoodisto(key)
          return
        }
      })
    }

    return { afterCreate }
  })
