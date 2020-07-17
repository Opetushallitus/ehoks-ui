import { flow, getEnv, Instance, types } from "mobx-state-tree"
import { APIResponse } from "types/APIResponse"
import { StoreEnvironment } from "types/StoreEnvironment"

// this allows us to proxy http://localhost:3000/auth-dev/ calls
// using webpack-development-server proxy
const devBackendWithoutHost = (url: string) =>
  // return url
  url.replace("http://localhost:3000", "")

const EnvironmentStoreModel = {
  virkailijaLoginUrl: types.optional(types.string, ""),
  virkailijaRaamitUrl: types.optional(types.string, ""),
  error: types.optional(types.string, ""),
  isLoading: false
}

export const EnvironmentStore = types
  .model("EnvironmentStore", EnvironmentStoreModel)
  .actions(self => {
    const { apiUrl, fetchSingle, fetch, errors, callerId } = getEnv<
      StoreEnvironment
    >(self)

    const getEnvironment = flow(function*(): any {
      self.isLoading = true
      try {
        const response: APIResponse = yield fetchSingle(
          apiUrl("misc/environment"),
          { headers: callerId() }
        )
        const { virkailijaLoginUrl, raamitUrl } = response.data
        self.virkailijaLoginUrl = devBackendWithoutHost(virkailijaLoginUrl)
        self.virkailijaRaamitUrl = devBackendWithoutHost(raamitUrl)
      } catch (error) {
        errors.logError("EnvironmentStore.getEnvironment", error.message)
      }
      self.isLoading = false
    })

    const fetchSwaggerJSON = flow(function*() {
      return yield fetch("/ehoks-virkailija-backend/doc/swagger.json")
    })

    const getCallerId = flow(function*(headers?: Headers) {
      return callerId(headers)
    })

    return { getEnvironment, fetchSwaggerJSON, getCallerId }
  })

export type IEnvironmentStore = Instance<typeof EnvironmentStore>
