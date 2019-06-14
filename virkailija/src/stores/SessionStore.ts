import { flow, getEnv, Instance, types } from "mobx-state-tree"
import { StoreEnvironment } from "types/StoreEnvironment"

export const OrganisationPrivilege = types.model("OrganisationPrivilege", {
  oid: types.string,
  privileges: types.array(types.string),
  roles: types.array(types.string)
})

export const VirkailijaUser = types.model("VirkailijaUser", {
  oidHenkilo: types.string,
  organisationPrivileges: types.array(OrganisationPrivilege)
})

const SessionStoreModel = {
  error: types.optional(types.string, ""),
  isLoading: false,
  userDidLogout: false,
  user: types.optional(types.union(VirkailijaUser, types.null), null)
}

export const SessionStore = types
  .model("SessionStore", SessionStoreModel)
  .actions(self => {
    const { apiUrl, fetchSingle, fetch, deleteResource, errors } = getEnv<
      StoreEnvironment
    >(self)

    const login = flow(function*(url: string) {
      self.isLoading = true
      try {
        const response = yield fetch(url, { mode: "no-cors" })
        self.user = response.data
      } catch (error) {
        self.error = error.message
      }
      self.isLoading = false
    })

    const checkSession = flow(function*() {
      self.isLoading = true
      try {
        const response = yield fetchSingle(apiUrl("virkailija/session"))
        self.user = response.data
      } catch (error) {
        self.error = error.message
      }
      self.isLoading = false
    })

    const logout = flow(function*() {
      self.isLoading = true
      try {
        yield deleteResource(apiUrl("virkailija/session"))
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

    return { checkSession, login, logout, resetUserDidLogout }
  })
  .views(self => {
    return {
      get isLoggedIn() {
        return self.user !== null
      }
    }
  })

export interface ISessionStore extends Instance<typeof SessionStore> {}
