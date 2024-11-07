import { types, getEnv, flow, getPropertyMembers } from "mobx-state-tree"
import { StoreEnvironment } from "types/StoreEnvironment"
import { IReactionDisposer, reaction } from "mobx"
import { APIResponse } from "types/APIResponse"

interface DynamicObject {
  [name: string]: any
}

export const EnrichTutkinnonOsaViitteet = (
  fieldName = "tutkinnonOsaViitteet"
) =>
  types
    .model({})
    .volatile(
      (): DynamicObject => ({
        disposeTutkinnonOsaFetcher: undefined as IReactionDisposer | undefined
      })
    )
    .actions(self => {
      const { apiUrl, apiPrefix, errors, fetchCollection, appendCallerId } =
        getEnv<StoreEnvironment>(self)

      const fetchTutkinnonOsaViitteet = flow(function* (id: number): any {
        try {
          const response: APIResponse = yield fetchCollection(
            apiUrl(
              `${apiPrefix}/external/eperusteet/tutkinnonosat/${id}/viitteet`
            ),
            { headers: appendCallerId() }
          )
          if (Object.keys(self).indexOf(fieldName) !== -1) {
            self[fieldName] = response.data
          } else {
            const { name } = getPropertyMembers(self)
            throw new Error(
              `Your mobx-state-tree model '${name}' is missing definition for '${fieldName}'`
            )
          }
        } catch (error) {
          errors.logError("EnrichTutkinnonOsa.fetchViitteet", error.message)
        }
      })

      return {
        afterCreate() {
          self.disposeTutkinnonOsaFetcher = reaction(
            () => self.tutkinnonOsa.id,
            id => {
              fetchTutkinnonOsaViitteet(id)
            }
          )
        },
        beforeDestroy() {
          // dispose tutkinnonOsa viitteet fetch reaction
          if (self.disposeTutkinnonOsaFetcher) {
            self.disposeTutkinnonOsaFetcher()
          }
        }
      }
    })
