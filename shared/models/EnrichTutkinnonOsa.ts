import { types, getEnv, flow } from "mobx-state-tree"
import { StoreEnvironment } from "types/StoreEnvironment"
import { IReactionDisposer, reaction } from "mobx"

interface DynamicObject {
  [name: string]: any
}

export const EnrichTutkinnonOsa = (
  fieldName: string = "tutkinnonOsaViitteet"
) => {
  return types
    .model({})
    .volatile(
      (_): DynamicObject => {
        return {
          disposeTutkinnonOsaFetcher: undefined as IReactionDisposer | undefined
        }
      }
    )
    .actions(self => {
      const { apiUrl, errors, fetchCollection } = getEnv<StoreEnvironment>(self)

      const fetchTutkinnonOsaViitteet = flow(function*(id: number) {
        try {
          const response = yield fetchCollection(
            apiUrl(`oppija/external/eperusteet/tutkinnonosat/${id}/viitteet`)
          )
          if (Object.keys(self).indexOf(fieldName) !== -1) {
            self[fieldName] = response.data
          } else {
            throw new Error(
              `Your mobx-state-tree model is missing definition for '${fieldName}'`
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
}
