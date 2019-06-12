import { flow, getEnv, Instance, types } from "mobx-state-tree"
import { StoreEnvironment } from "types/StoreEnvironment"

// this allows us to proxy http://localhost:3000/auth-dev/ calls
// using webpack-development-server proxy
const devBackendWithoutHost = (url: string) => {
  // return url
  return url.replace("http://localhost:3000", "")
}

const EnvironmentStoreModel = {
  virkailijaLoginUrl: types.optional(types.string, ""),
  error: types.optional(types.string, ""),
  isLoading: false
}

export const EnvironmentStore = types
  .model("EnvironmentStore", EnvironmentStoreModel)
  .actions(self => {
    const { apiUrl, fetchSingle, fetch, errors } = getEnv<StoreEnvironment>(
      self
    )

    const getEnvironment = flow(function*() {
      self.isLoading = true
      try {
        const response = yield fetchSingle(apiUrl("misc/environment"))
        const { virkailijaLoginUrl } = response.data
        self.virkailijaLoginUrl = devBackendWithoutHost(virkailijaLoginUrl)
      } catch (error) {
        errors.logError("EnvironmentStore.getEnvironment", error.message)
      }
      self.isLoading = false
    })

    const fetchSwaggerJSON = flow(function*() {
      const response = yield fetch("/ehoks-virkailija-backend/doc/swagger.json")
      return response
    })

    return { getEnvironment, fetchSwaggerJSON }
  })

export interface IEnvironmentStore extends Instance<typeof EnvironmentStore> {}
