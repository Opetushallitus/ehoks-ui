import { types, getEnv, flow } from "mobx-state-tree"
import { StoreEnvironment } from "types/StoreEnvironment"

interface DynamicObject {
  [name: string]: any
}

// dumb cache for preventing multiple fetches for the same koodi-uri's
const cachedResponses: DynamicObject = {}

export const EnrichKoodiUri = types
  .model({})
  // we need this typing to avoid 'missing index signature' error
  // when assingning to self[dynamicKey]
  .volatile((_): DynamicObject => ({}))
  .actions(self => {
    const { apiUrl, fetchSingle } = getEnv<StoreEnvironment>(self)

    const fetchEPerusteet = flow(function*(key: string, code: string) {
      const [dynamicKey] = key.split("KoodiUri") // key without KoodiUri
      // check our global cache first
      cachedResponses[code] =
        cachedResponses[code] ||
        fetchSingle(apiUrl(`oppija/external/eperusteet/${code}`))
      const response = yield cachedResponses[code]
      if (Object.keys(self).indexOf(dynamicKey) > -1) {
        self[dynamicKey] = response.data
      } else {
        throw new Error(
          `Your mobx-state-tree model is missing definition for '${dynamicKey}'`
        )
      }
    })

    const fetchKoodisto = flow(function*(key: string, code: string) {
      const [dynamicKey] = key.split("KoodiUri") // key without KoodiUri
      // check our global cache first
      cachedResponses[code] =
        cachedResponses[code] ||
        fetchSingle(apiUrl(`oppija/external/koodisto/${code}`))
      const { data } = yield cachedResponses[code]
      // we currently only need nimi from KoodistoKoodi
      if (Object.keys(self).indexOf(dynamicKey) > -1) {
        self[dynamicKey] = { nimi: data.metadata[0].nimi }
      } else {
        throw new Error(
          `Your mobx-state-tree model is missing definition for '${dynamicKey}'`
        )
      }
    })

    const afterCreate = () => {
      Object.keys(self).forEach(key => {
        if (key.match(/tutkinnonOsaKoodiUri/)) {
          const codes: string[] = Array.isArray(self[key])
            ? self[key]
            : [self[key]]
          codes.forEach(code => {
            fetchEPerusteet(key, code)
          })
        } else if (key.match(/KoodiUri/)) {
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
