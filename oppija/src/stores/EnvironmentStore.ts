import { flow, getEnv, Instance, types } from "mobx-state-tree"
import { APIResponse } from "types/APIResponse"
import { StoreEnvironment } from "types/StoreEnvironment"

// this allows us to proxy http://localhost:3000/auth-dev/ calls
// using webpack-development-server proxy
const devBackendWithoutHost = (url: string) =>
  url.replace("http://localhost:3000", "")

const EnvironmentStoreModel = {
  eperusteetPerusteUrl: types.optional(types.string, ""),
  error: types.optional(types.string, ""),
  isLoading: false,
  opintopolkuLoginUrlFi: types.optional(types.string, ""),
  opintopolkuLoginUrlSv: types.optional(types.string, ""),
  opintopolkuLogoutUrlFi: types.optional(types.string, ""),
  opintopolkuLogoutUrlSv: types.optional(types.string, ""),
  virkailijaLoginUrl: types.optional(types.string, ""),
  casOppijaLoginUrl: types.optional(types.string, "")
}

export const EnvironmentStore = types
  .model("EnvironmentStore", EnvironmentStoreModel)
  .actions(self => {
    const { apiUrl, fetchSingle, fetch, errors, appendCallerId } = getEnv<
      StoreEnvironment
    >(self)

    const getEnvironment = flow(function*(): any {
      self.isLoading = true
      try {
        const response: APIResponse = yield fetchSingle(
          apiUrl("misc/environment"),
          { headers: appendCallerId() }
        )
        const {
          eperusteetPerusteUrl,
          opintopolkuLoginUrlFi,
          opintopolkuLoginUrlSv,
          opintopolkuLogoutUrlFi,
          opintopolkuLogoutUrlSv,
          virkailijaLoginUrl,
          casOppijaLoginUrl
        } = response.data
        self.eperusteetPerusteUrl = eperusteetPerusteUrl
        self.opintopolkuLoginUrlFi = devBackendWithoutHost(
          opintopolkuLoginUrlFi
        )
        self.opintopolkuLoginUrlSv = devBackendWithoutHost(
          opintopolkuLoginUrlSv
        )
        self.opintopolkuLogoutUrlFi = devBackendWithoutHost(
          opintopolkuLogoutUrlFi
        )
        self.opintopolkuLogoutUrlSv = devBackendWithoutHost(
          opintopolkuLogoutUrlSv
        )
        self.virkailijaLoginUrl = virkailijaLoginUrl
        self.casOppijaLoginUrl = devBackendWithoutHost(casOppijaLoginUrl)
      } catch (error) {
        errors.logError("EnvironmentStore.getEnvironment", error.message)
      }
      self.isLoading = false
    })

    const fetchSwaggerJSON = flow(function*() {
      return yield fetch("/ehoks-oppija-backend/doc/swagger.json")
    })

    return { getEnvironment, fetchSwaggerJSON }
  })

export type IEnvironmentStore = Instance<typeof EnvironmentStore>
