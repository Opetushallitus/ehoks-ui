import { types, getEnv, flow, getPropertyMembers } from "mobx-state-tree"
import { StoreEnvironment } from "types/StoreEnvironment"
import { APIResponse } from "types/APIResponse"

interface DynamicObject {
  [name: string]: any
}

// dumb cache for preventing multiple fetches for the same koodi-uri's
const cachedResponses: DynamicObject = {}

export const EnrichOrganisaatioOid = (fieldPostfix: string) => {
  return (
    types
      .model({})
      // we need this typing to avoid 'missing index signature' error
      // when assigning to self[dynamicKey]
      .volatile((_): DynamicObject => ({}))
      .actions(self => {
        const { apiUrl, apiPrefix, errors, fetchSingle } = getEnv<
          StoreEnvironment
        >(self)

        const fetchOrganisaatio = flow(function*(
          key: string,
          code: string
        ): any {
          try {
            const [dynamicKey] = key.split("Oid") // key without Oid
            // check our global cache first
            cachedResponses[code] =
              cachedResponses[code] ||
              fetchSingle(apiUrl(`${apiPrefix}/external/organisaatio/${code}`))
            const response: APIResponse = yield cachedResponses[code]
            if (Object.keys(self).indexOf(dynamicKey) > -1) {
              self[dynamicKey] = response.data
            } else {
              const { name } = getPropertyMembers(self)
              throw new Error(
                `Your mobx-state-tree model '${name}' is missing definition for '${dynamicKey}'`
              )
            }
          } catch (error) {
            errors.logError(
              "EnrichOrganisaatioOid.fetchOrganisaatio",
              error.message
            )
          }
        })

        const afterCreate = () => {
          Object.keys(self).forEach(key => {
            if (key.match(new RegExp(fieldPostfix)) && self[key]) {
              const codes: string[] = Array.isArray(self[key])
                ? self[key]
                : [self[key]]
              codes.forEach(code => {
                fetchOrganisaatio(key, code)
              })
            }
          })
        }

        return { afterCreate }
      })
  )
}
