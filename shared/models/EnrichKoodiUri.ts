import { types, getEnv, flow } from "mobx-state-tree"
import { StoreEnvironment } from "types/StoreEnvironment"
import { APIResponse } from "types/APIResponse"

interface DynamicObject {
  [name: string]: any
}

// dumb cache for preventing multiple fetches for the same koodi-uri's
const cachedResponses: DynamicObject = {}

export const EnrichKoodiUri = types
  .model({})
  // we need this typing to avoid 'missing index signature' error
  // when assigning to self[dynamicKey]
  .volatile((_): DynamicObject => ({}))
  .actions(self => {
    const { apiUrl, apiPrefix, errors, fetchSingle } = getEnv<StoreEnvironment>(
      self
    )

    const fetchEPerusteet = flow(function*(key: string, code: string): any {
      try {
        const [dynamicKey] = key.split("KoodiUri") // key without KoodiUri
        // check our global cache first
        cachedResponses[code] =
          cachedResponses[code] ||
          fetchSingle(apiUrl(`${apiPrefix}/external/eperusteet/${code}`))
        const response: APIResponse = yield cachedResponses[code]
        if (Object.keys(self).indexOf(dynamicKey) > -1) {
          self[dynamicKey] = response.data
        } else {
          throw new Error(
            `Your mobx-state-tree model is missing definition for '${dynamicKey}'`
          )
        }
      } catch (error) {
        errors.logError("EnrichKoodiUri.fetchEPerusteet", error.message)
      }
    })

    const fetchKoodisto = flow(function*(key: string, code: string): any {
      try {
        const [dynamicKey] = key.split("KoodiUri") // key without KoodiUri
        // check our global cache first
        cachedResponses[code] =
          cachedResponses[code] ||
          fetchSingle(apiUrl(`${apiPrefix}/external/koodisto/${code}`))
        const { data }: APIResponse = yield cachedResponses[code]
        // we currently only need nimi from KoodistoKoodi
        if (Object.keys(self).indexOf(dynamicKey) > -1) {
          self[dynamicKey] = data.metadata.reduce((result: any, meta: any) => {
            result[meta.kieli.toLowerCase()] = meta
            return result
          }, {})
        } else {
          throw new Error(
            `Your mobx-state-tree model is missing definition for '${dynamicKey}'`
          )
        }
      } catch (error) {
        errors.logError("EnrichKoodiUri.fetchKoodisto", error.message)
      }
    })

    const afterCreate = () => {
      Object.keys(self).forEach(key => {
        if (key.match(/tutkinnonOsaKoodiUri/) && self[key]) {
          const codes: string[] = Array.isArray(self[key])
            ? self[key]
            : [self[key]]
          codes.forEach(code => {
            fetchEPerusteet(key, code)
          })
        } else if (key.match(/KoodiUri/) && self[key]) {
          const codes: string[] = Array.isArray(self[key])
            ? self[key]
            : [self[key]]
          codes.forEach(code => {
            fetchKoodisto(key, code)
          })
        }
      })
    }

    return { afterCreate }
  })
