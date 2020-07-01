import { flow, getEnv, getPropertyMembers, types } from "mobx-state-tree"
import { StoreEnvironment } from "../../types/StoreEnvironment"
import { APIResponse } from "../../types/APIResponse"

interface DynamicObject {
  [name: string]: any
}

// dumb cache for preventing multiple fetches for the same koodi-uri's
const cachedResponses: DynamicObject = {}

export const EnrichKoodistoKoodiUri = (
  ...fieldsToEnrich: {
    enrichedField: string
    koodiUriField: string
  }[]
) =>
  types
    .model({})
    // we need this typing to avoid 'missing index signature' error
    // when assigning to self[enrichedField]
    .volatile((): DynamicObject => ({}))
    .actions(self => {
      const { apiUrl, apiPrefix, errors, fetchSingle, callerId } = getEnv<
        StoreEnvironment
      >(self)

      const fieldDoesntExist = (enrichedField: string) =>
        Object.keys(self).indexOf(enrichedField) < 0

      function logMissingFieldError(enrichedField: string) {
        const { name } = getPropertyMembers(self)
        errors.logError(
          "EnrichKoodiUri.fetchKoodisto",
          `Your mobx-state-tree model '${name}' is missing definition for '${enrichedField}'`
        )
      }

      const getFromKoodistoService = (koodiUri: string) =>
        fetchSingle(apiUrl(`${apiPrefix}/external/koodisto/${koodiUri}`), {
          headers: callerId()
        })

      const parseResponse = (data: any) =>
        data.metadata.reduce((result: any, meta: any) => {
          result[meta.kieli.toLowerCase()] = meta
          return result
        }, {})

      const fetchKoodisto = flow(function*(
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
            cachedResponses[koodiUri] || getFromKoodistoService(koodiUri)
          const { data }: APIResponse = yield cachedResponses[koodiUri]
          self[enrichedField] = parseResponse(data)
        } catch (error) {
          errors.logError("EnrichKoodiUri.fetchKoodisto", error.message)
        }
      })

      const afterCreate = () => {
        fieldsToEnrich.forEach(key => {
          fetchKoodisto(key.enrichedField, key.koodiUriField)
        })
      }

      return { afterCreate }
    })
