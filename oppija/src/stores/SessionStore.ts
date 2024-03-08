import { flow, getEnv, getSnapshot, Instance, types } from "mobx-state-tree"
import { SessionUser } from "models/SessionUser"
import { Settings } from "models/Settings"
import { APIResponse } from "types/APIResponse"
import { StoreEnvironment } from "types/StoreEnvironment"

const SessionStoreModel = {
  error: types.optional(types.string, ""),
  settings: types.optional(Settings, {}),
  userDidLogout: false,
  user: types.maybe(SessionUser),
  selectedOrganisationOid: "",
  isLoading: types.optional(types.boolean, false)
}

export const SessionStore = types
  .model("SessionStore", SessionStoreModel)
  .actions(self => {
    const {
      apiUrl,
      fetchSingle,
      deleteResource,
      errors,
      appendCallerId
    } = getEnv<StoreEnvironment>(self)

    const checkSession = flow(function*(): any {
      self.isLoading = true
      try {
        const response: APIResponse = yield fetchSingle(
          apiUrl("oppija/session"),
          { headers: appendCallerId() }
        )
        self.user = response.data
      } catch (error) {
        self.error = error.message
      }

      if (self.user) {
        try {
          yield fetchUserInfo()
        } catch (error) {
          errors.logError("SessionStore.checkSession", error.message)
        }
      }
      self.isLoading = false
    })

    const fetchUserInfo = flow(function*(): any {
      try {
        const response: APIResponse = yield fetchSingle(
          apiUrl("oppija/session/user-info"),
          { headers: appendCallerId() }
        )
        if (response.data.usingValtuudet) {
          errors.logError(
            "SessionStore.valtuudetKaytossa",
            "SessionStore.valtuudet"
          )
          response.data.oid = ""
        }
        self.user = response.data
      } catch (error) {
        errors.logError("SessionStore.getUserInfo", error.message)
      }
    })

    const fetchSettings = flow(function*(): any {
      try {
        const response: APIResponse = yield fetchSingle(
          apiUrl("oppija/session/settings"),
          { headers: appendCallerId() }
        )
        self.settings = response.data
      } catch (error) {
        errors.logError("SessionStore.fetchSettings", error.message)
      }
    })

    const saveSettings = flow(function*() {
      try {
        yield fetchSingle(apiUrl("oppija/session/settings"), {
          method: "put",
          body: JSON.stringify(getSnapshot(self.settings)),
          headers: appendCallerId(
            new Headers({ "Content-Type": "application/json" })
          )
        })
      } catch (error) {
        errors.logError("SessionStore.saveSettings", error.message)
      }
    })

    const logoutOppija = flow(function*() {
      self.isLoading = true
      try {
        yield deleteResource(apiUrl("oppija/session"), {
          headers: appendCallerId()
        })
        self.user = undefined
        self.userDidLogout = true
        self.isLoading = false
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
      logoutOppija,
      resetUserDidLogout,
      saveSettings
    }
  })
  .views(self => ({
    get isLoggedIn() {
      return !!self.user
    }
  }))

export type ISessionStore = Instance<typeof SessionStore>
