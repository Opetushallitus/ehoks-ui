import { flow, getEnv, Instance, types } from "mobx-state-tree"
import { APIResponse } from "types/APIResponse"
import { StoreEnvironment } from "types/StoreEnvironment"

// this allows us to proxy http://localhost:3000/auth-dev/ calls
// using webpack-development-server proxy
const devBackendWithoutHost = (url: string) => {
  return url.replace("http://localhost:3000", "")
}

const EnvironmentStoreModel = {
  eperusteetPerusteUrl: types.optional(types.string, ""),
  error: types.optional(types.string, ""),
  isLoading: false,
  opintopolkuLoginUrl: types.optional(types.string, ""),
  opintopolkuLogoutUrl: types.optional(types.string, ""),
  virkailijaLoginUrl: types.optional(types.string, "") // TODO: remove when HOKS form is removed from oppija
}

export const EnvironmentStore = types
  .model("EnvironmentStore", EnvironmentStoreModel)
  .actions(self => {
    const { apiUrl, fetchSingle, fetch, errors } = getEnv<StoreEnvironment>(
      self
    )

    const getEnvironment = flow(function*(): any {
      self.isLoading = true
      try {
        const response: APIResponse = yield fetchSingle(
          apiUrl("misc/environment")
        )
        const {
          eperusteetPerusteUrl,
          opintopolkuLoginUrl,
          opintopolkuLogoutUrl
        } = response.data
        self.eperusteetPerusteUrl = eperusteetPerusteUrl
        self.opintopolkuLoginUrl = devBackendWithoutHost(opintopolkuLoginUrl)
        self.opintopolkuLogoutUrl = devBackendWithoutHost(opintopolkuLogoutUrl)
      } catch (error) {
        errors.logError("EnvironmentStore.getEnvironment", error.message)
      }
      self.isLoading = false
    })

    const fetchSwaggerJSON = flow(function*() {
      const response = yield fetch("/ehoks-oppija-backend/doc/swagger.json")
      return response
    })

    return { getEnvironment, fetchSwaggerJSON }
  })

export interface IEnvironmentStore extends Instance<typeof EnvironmentStore> {}
