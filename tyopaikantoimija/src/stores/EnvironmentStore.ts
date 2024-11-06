import { flow, getEnv, Instance, types } from "mobx-state-tree"
import { APIResponse } from "types/APIResponse"
import { StoreEnvironment } from "types/StoreEnvironment"

const EnvironmentStoreModel = {
  eperusteetPerusteUrl: types.optional(types.string, ""),
  error: types.optional(types.string, ""),
  isLoading: false,
  virkailijaLoginUrl: types.optional(types.string, "")
}

export const EnvironmentStore = types
  .model("EnvironmentStore", EnvironmentStoreModel)
  .actions((self) => {
    const { apiUrl, fetchSingle, fetch, errors, appendCallerId } =
      getEnv<StoreEnvironment>(self)

    const getEnvironment = flow(function* (): any {
      self.isLoading = true
      try {
        const response: APIResponse = yield fetchSingle(
          apiUrl("misc/environment"),
          { headers: appendCallerId() }
        )
        const { eperusteetPerusteUrl, virkailijaLoginUrl } = response.data
        self.eperusteetPerusteUrl = eperusteetPerusteUrl
        self.virkailijaLoginUrl = virkailijaLoginUrl
      } catch (error) {
        errors.logError("EnvironmentStore.getEnvironment", error.message)
      }
      self.isLoading = false
    })

    const fetchSwaggerJSON = flow(function* () {
      const response = yield fetch("/ehoks-oppija-backend/doc/swagger.json")
      return response
    })

    return { getEnvironment, fetchSwaggerJSON }
  })

export type IEnvironmentStore = Instance<typeof EnvironmentStore>
