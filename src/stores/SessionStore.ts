import { apiUrl } from "config"
import { flow, getEnv, getRoot, Instance, types } from "mobx-state-tree"
import { SessionUser } from "models/SessionUser"
import { IRootStore } from "stores/RootStore"
import { IStoreEnvironment } from "utils"

const SessionStoreModel = {
  error: types.optional(types.string, ""),
  isLoading: false,
  user: types.optional(types.union(SessionUser, types.null), null)
}

export const SessionStore = types
  .model("SessionStore", SessionStoreModel)
  .actions(self => {
    const root = getRoot<IRootStore>(self)
    const { fetchSingle, deleteResource } = getEnv<IStoreEnvironment>(self)

    const checkSession = flow(function*(): any {
      self.isLoading = true
      const response = yield fetchSingle(apiUrl("session"))
      self.user = response.data
      // if logged in, call update-user-info API, which updates current session with 'oid'
      // we don't need to deal with 'oid' in UI, this is just needed to obtain valid session cookie
      if (self.user) {
        try {
          yield fetchSingle(apiUrl("session/update-user-info"), {
            method: "POST"
          })
          yield getUserInfo()
        } catch (error) {
          root.errors.logError("SessionStore.checkSession", error.message)
        }
      }
      self.isLoading = false
    })

    const getUserInfo = flow(function*(): any {
      self.isLoading = true
      try {
        const response = yield fetchSingle(apiUrl("session/user-info"))
        self.user = response.data
      } catch (error) {
        root.errors.logError("SessionStore.getUserInfo", error.message)
      }
      self.isLoading = false
    })

    const logout = flow(function*(): any {
      self.isLoading = true
      try {
        yield deleteResource(apiUrl("session"))
        self.user = null
        self.isLoading = false
      } catch (error) {
        root.errors.logError("SessionStore.logout", error.message)
      }
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

export interface ISessionStore extends Instance<typeof SessionStore> {}
