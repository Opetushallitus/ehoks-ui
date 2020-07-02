import { types, getEnv, flow, getPropertyMembers } from "mobx-state-tree"
import { StoreEnvironment } from "types/StoreEnvironment"
import { APIResponse } from "types/APIResponse"

interface DynamicObject {
  [name: string]: any
}

// dumb cache for preventing multiple fetches for the same koodi-uri's
const cachedResponses: DynamicObject = {}

export const EnrichOrganisaatioOidNEW = (
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
          if (Object.keys(self).indexOf(enrichedProperty) < 0) {
            const { name } = getPropertyMembers(self)
            errors.logError(
              "EnrichOrganisaatioOid.fetchOrganisaatio",
              `Your mobx-state-tree model '${name}' is missing definition for '${enrichedProperty}'`
            )
            return
          }

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
          self[enrichedProperty] = response.data
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
