import { apiUrl } from "config"
import { flow, getRoot, Instance, types } from "mobx-state-tree"
import { SessionUser } from "models/SessionUser"
import { RootStore } from "stores/RootStore"

const SessionStoreModel = {
  error: types.optional(types.string, ""),
  isLoading: false,
  user: types.optional(types.union(SessionUser, types.null), null)
}

export const SessionStore = types
  .model("SessionStore", SessionStoreModel)
  .actions(self => {
    const root = getRoot<Instance<typeof RootStore>>(self)

    const checkSession = flow(function*(): any {
      self.isLoading = true
      const response = yield root.fetchSingle(apiUrl("session"))
      self.user = response.data
      // if logged in, call update-user-info API, which updates current session with 'oid'
      // we don't need to deal with 'oid' in UI, this is just needed to obtain valid session cookie
      if (self.user) {
        yield root.fetchSingle(apiUrl("session/update-user-info"), {
          method: "POST"
        })
        yield getUserInfo()
      }
      self.isLoading = false
    })

    const getUserInfo = flow(function*(): any {
      self.isLoading = true
      try {
        const response = yield root.fetchSingle(apiUrl("session/user-info"))
        self.user = response.data
      } catch (error) {
        // TODO: show error in UI
        self.error = error.message
      }
      self.isLoading = false
    })

    const logout = flow(function*(): any {
      self.isLoading = true
      yield root.deleteResource(apiUrl("session"))
      self.user = null
      self.isLoading = false
    })

    return { checkSession, getUserInfo, logout }
  })
  .views(self => {
    return {
      get isLoggedIn() {
        return self.user !== null
      }
    }
  })
