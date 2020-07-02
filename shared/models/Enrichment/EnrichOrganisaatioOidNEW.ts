import { types, getEnv, flow, getPropertyMembers } from "mobx-state-tree"
import { StoreEnvironment } from "types/StoreEnvironment"
import { APIResponse } from "types/APIResponse"

interface DynamicObject {
  [name: string]: any
}

// dumb cache for preventing multiple fetches for the same koodi-uri's
const cachedResponses: DynamicObject = {}

export const EnrichOrganisaatioOid = (
  ...propertiesToEnrich: {
    enrichedProperty: string
    organzationOidProperty: string
  }[]
) =>
  types
    .model({})
    // we need this typing to avoid 'missing index signature' error
    // when assigning to self[dynamicKey]
    .volatile((): DynamicObject => ({}))
    .actions(self => {
      const { apiUrl, apiPrefix, errors, fetchSingle, callerId } = getEnv<
        StoreEnvironment
      >(self)

      const fetchOrganisaatio = flow(function*(
        enrichedProperty: string,
        organisaatioOid: string
      ): any {
        try {
          const [dynamicKey] = enrichedProperty.split("Oid") // key without Oid
          // check our global cache first
          cachedResponses[organisaatioOid] =
            cachedResponses[organisaatioOid] ||
            fetchSingle(
              apiUrl(`${apiPrefix}/external/organisaatio/${organisaatioOid}`),
              {
                headers: callerId()
              }
            )
          const response: APIResponse = yield cachedResponses[organisaatioOid]
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
        propertiesToEnrich.forEach(prop => {
          fetchOrganisaatio(prop.enrichedProperty, prop.organzationOidProperty)
        })
      }

      return { afterCreate }
    })
