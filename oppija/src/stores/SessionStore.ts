import { flow, getEnv, Instance, types } from "mobx-state-tree"
import { SessionUser } from "models/SessionUser"
import { StoreEnvironment } from "types/StoreEnvironment"

const SessionStoreModel = {
  error: types.optional(types.string, ""),
  isLoading: false,
  userDidLogout: false,
  user: types.optional(types.union(SessionUser, types.null), null),
  selectedOrganisationOid: ""
}

export const SessionStore = types
  .model("SessionStore", SessionStoreModel)
  .actions(self => {
    const { apiUrl, fetchSingle, deleteResource, errors } = getEnv<
      StoreEnvironment
    >(self)

    const checkSession = flow(function*() {
      self.isLoading = true
      try {
        const response = yield fetchSingle(apiUrl("oppija/session"))
        self.user = response.data
      } catch (error) {
        self.error = error.message
      }

      // if logged in, call update-user-info API, which updates current session with 'oid'
      // we don't need to deal with 'oid' in UI, this is just needed to obtain valid session cookie
      if (self.user) {
        try {
          yield fetchSingle(apiUrl("oppija/session/update-user-info"), {
            method: "POST"
          })
          yield getUserInfo()
        } catch (error) {
          errors.logError("SessionStore.checkSession", error.message)
        }
      }
      self.isLoading = false
    })

    const getUserInfo = flow(function*() {
      self.isLoading = true
      try {
        const response = yield fetchSingle(apiUrl("oppija/session/user-info"))
        self.user = response.data
      } catch (error) {
        errors.logError("SessionStore.getUserInfo", error.message)
      }
      self.isLoading = false
    })

    const logout = flow(function*() {
      self.isLoading = true
      try {
        yield deleteResource(apiUrl("oppija/session"))
        self.user = null
        self.isLoading = false
        self.userDidLogout = true
      } catch (error) {
        errors.logError("SessionStore.logout", error.message)
      }
    })

    // remove this when LuoHOKS is removed from oppija bundle
    const login = (url: string) => {
      console.log("URL", url)
    }

    const resetUserDidLogout = () => {
      self.userDidLogout = false
    }

    return { checkSession, getUserInfo, login, logout, resetUserDidLogout }
  })
  .views(self => {
    return {
      get isLoggedIn() {
        return self.user !== null
      }
    }
  })

export interface ISessionStore extends Instance<typeof SessionStore> {}
