import { flow, getEnv, getPropertyMembers, types } from "mobx-state-tree"
import { StoreEnvironment } from "../../types/StoreEnvironment"
import { APIResponse } from "../../types/APIResponse"

interface DynamicObject {
  [name: string]: any
}

// dumb cache for preventing multiple fetches for the same koodi-uri's
const cachedResponses: DynamicObject = {}

export const EnrichKoodistoKoodiUri = (...fieldsToEnrich: string[]) =>
  types
    .model({})
    // we need this typing to avoid 'missing index signature' error
    // when assigning to self[dynamicKey]
    .volatile((): DynamicObject => ({}))
    .actions(self => {
      const { apiUrl, apiPrefix, errors, fetchSingle, callerId } = getEnv<
        StoreEnvironment
      >(self)

      const fetchKoodisto = flow(function*(
        enrichedField: string,
        koodiUri: string
      ): any {
        try {
          if (Object.keys(self).indexOf(enrichedField) < 0) {
            const { name } = getPropertyMembers(self)
            errors.logError(
              "EnrichKoodiUri.fetchKoodisto",
              `Your mobx-state-tree model '${name}' is missing definition for '${enrichedField}'`
            )
            return
          }

          // check our global cache first
          cachedResponses[koodiUri] =
            cachedResponses[koodiUri] ||
            fetchSingle(apiUrl(`${apiPrefix}/external/koodisto/${koodiUri}`), {
              headers: callerId()
            })
          const { data }: APIResponse = yield cachedResponses[koodiUri]
          // we currently only need nimi from KoodistoKoodi
          self[enrichedField] = data.metadata.reduce(
            (result: any, meta: any) => {
              result[meta.kieli.toLowerCase()] = meta
              return result
            },
            {}
          )
        } catch (error) {
          errors.logError("EnrichKoodiUri.fetchKoodisto", error.message)
        }
      })

      const appendKoodiUri = (key: string) => key + "koodiUri"

      const afterCreate = () => {
        fieldsToEnrich.forEach(key => {
          fetchKoodisto(key, appendKoodiUri(key))
        })
      }

      return { afterCreate }
    })
