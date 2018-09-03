import { apiUrl } from "config"
import { flow, getRoot, Instance, types } from "mobx-state-tree"
import { SessionUser } from "models/SessionUser"
import { RootStore } from "stores/RootStore"

const SessionStoreModel = {
  isLoading: false,
  loginUrl: types.optional(types.string, ""),
  user: types.optional(types.union(SessionUser, types.null), null)
}

export const SessionStore = types
  .model("SessionStore", SessionStoreModel)
  .actions(self => {
    const root = getRoot<Instance<typeof RootStore>>(self)

    const checkSession = flow(function*(): any {
      self.isLoading = true
      const response = yield root.fetchSingle(apiUrl("session/opintopolku/"))
      self.loginUrl = response.meta.opintopolkuLoginUrl
      self.user = response.data
      self.isLoading = false
    })

    const logout = flow(function*(): any {
      self.isLoading = true
      yield root.deleteResource(apiUrl("session/opintopolku/"))
      self.user = null
      self.isLoading = false
    })

    return { checkSession, logout }
  })
  .views(self => {
    return {
      get isLoggedIn() {
        return self.user !== null
      }
    }
  })
