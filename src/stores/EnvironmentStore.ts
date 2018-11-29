import { apiUrl } from "config"
import { flow, getEnv, getRoot, Instance, types } from "mobx-state-tree"
import { IRootStore } from "stores/RootStore"
import { IStoreEnvironment } from "utils"

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
    const root = getRoot<IRootStore>(self)
    const { fetchSingle } = getEnv<IStoreEnvironment>(self)

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
        self.opintopolkuLoginUrl = opintopolkuLoginUrl
        self.opintopolkuLogoutUrl = opintopolkuLogoutUrl
      } catch (error) {
        root.errors.logError("EnvironmentStore.getEnvironment", error.message)
      }
      self.isLoading = false
    })

    return { getEnvironment }
  })

export interface IEnvironmentStore extends Instance<typeof EnvironmentStore> {}
