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
      const { apiUrl, apiPrefix, errors, fetchSingle, appendCallerId } =
        getEnv<StoreEnvironment>(self)

      const propertyDoesntExist = (enrichedProperty: string) =>
        Object.keys(self).indexOf(enrichedProperty) < 0

      function logMissingPropertyError(enrichedProperty: string) {
        const { name } = getPropertyMembers(self)
        errors.logError(
          "EnrichOrganisaatioOid.fetchOrganisaatio",
          `Your mobx-state-tree model '${name}' is missing definition for '${enrichedProperty}'`
        )
      }

      const getFromOrganisaatioService = (organisaatioOid: string) =>
        fetchSingle(
          apiUrl(`${apiPrefix}/external/organisaatio/${organisaatioOid}`),
          {
            headers: appendCallerId()
          }
        )

      const fetchOrganisaatio = flow(function* (
        enrichedProperty: string,
        organisaatioOid: string
      ): any {
        try {
          if (propertyDoesntExist(enrichedProperty)) {
            logMissingPropertyError(enrichedProperty)
            return
          }

          // check our global cache first
          cachedResponses[organisaatioOid] =
            cachedResponses[organisaatioOid] ||
            getFromOrganisaatioService(organisaatioOid)
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
          const organizationOid = self[prop.organzationOidProperty]
          if (organizationOid) {
            fetchOrganisaatio(prop.enrichedProperty, organizationOid)
          }
        })
      }

      return { afterCreate }
    })
