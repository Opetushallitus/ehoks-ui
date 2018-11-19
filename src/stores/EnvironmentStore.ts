import { apiUrl } from "config"
import { flow, getEnv, Instance, types } from "mobx-state-tree"
import { IStoreEnvironment } from "utils"

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
  opintopolkuLogoutUrl: types.optional(types.string, "")
}

export const EnvironmentStore = types
  .model("EnvironmentStore", EnvironmentStoreModel)
  .actions(self => {
    const { fetchSingle, errors } = getEnv<IStoreEnvironment>(self)

    const getEnvironment = flow(function*(): any {
      self.isLoading = true
      try {
        const response = yield fetchSingle(apiUrl("misc/environment"))
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

    return { getEnvironment }
  })

export interface IEnvironmentStore extends Instance<typeof EnvironmentStore> {}
