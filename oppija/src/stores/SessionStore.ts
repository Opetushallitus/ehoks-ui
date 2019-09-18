import { flow, getEnv, getSnapshot, Instance, types } from "mobx-state-tree"
import { SessionUser } from "models/SessionUser"
import { Settings } from "models/Settings"
import { APIResponse } from "types/APIResponse"
import { StoreEnvironment } from "types/StoreEnvironment"

const SessionStoreModel = {
  error: types.optional(types.string, ""),
  isLoading: false,
  settings: types.optional(Settings, {}),
  userDidLogout: false,
  user: types.maybeNull(SessionUser),
  selectedOrganisationOid: ""
}

export const SessionStore = types
  .model("SessionStore", SessionStoreModel)
  .actions(self => {
    const { apiUrl, fetchSingle, deleteResource, errors } = getEnv<
      StoreEnvironment
    >(self)

    const checkSession = flow(function*(): any {
      self.isLoading = true
      try {
        const response: APIResponse = yield fetchSingle(
          apiUrl("oppija/session")
        )
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
          yield fetchUserInfo()
        } catch (error) {
          errors.logError("SessionStore.checkSession", error.message)
        }
      }
      self.isLoading = false
    })

    const fetchUserInfo = flow(function*(): any {
      self.isLoading = true
      try {
        const response: APIResponse = yield fetchSingle(
          apiUrl("oppija/session/user-info")
        )
        self.user = response.data
      } catch (error) {
        errors.logError("SessionStore.fetchUserInfo", error.message)
      }
      self.isLoading = false
    })

    const fetchSettings = flow(function*(): any {
      self.isLoading = true
      try {
        const response: APIResponse = yield fetchSingle(
          apiUrl("oppija/session/settings")
        )
        self.settings = response.data
      } catch (error) {
        errors.logError("SessionStore.fetchSettings", error.message)
      }
      self.isLoading = false
    })

    const saveSettings = flow(function*() {
      self.isLoading = true
      try {
        yield fetchSingle(apiUrl("oppija/session/settings"), {
          method: "put",
          body: JSON.stringify(getSnapshot(self.settings)),
          headers: {
            "Content-Type": "application/json"
          }
        })
      } catch (error) {
        errors.logError("SessionStore.saveSettings", error.message)
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

    const resetUserDidLogout = () => {
      self.userDidLogout = false
    }

    return {
      checkSession,
      fetchSettings,
      fetchUserInfo,
      logout,
      resetUserDidLogout,
      saveSettings
    }
  })
  .views(self => {
    return {
      get isLoggedIn() {
        return self.user !== null
      }
    }
  })

export interface ISessionStore extends Instance<typeof SessionStore> {}
