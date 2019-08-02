import { withQueryString } from "fetchUtils"
import { flow, getEnv, Instance, types } from "mobx-state-tree"
import { IOrganisation, OrganisationModel } from "types/Organisation"
import { StoreEnvironment } from "types/StoreEnvironment"

export const OrganisationPrivilege = types.model("OrganisationPrivilege", {
  oid: types.string,
  privileges: types.array(types.string),
  roles: types.array(types.string),
  childOrganisations: types.array(types.string)
})

export const VirkailijaUser = types.model("VirkailijaUser", {
  oidHenkilo: types.string,
  organisationPrivileges: types.array(OrganisationPrivilege)
})

const SessionStoreModel = {
  error: types.optional(types.string, ""),
  isLoading: false,
  userDidLogout: false,
  user: types.optional(types.union(VirkailijaUser, types.null), null),
  selectedOrganisationOid: types.optional(types.string, ""),
  organisations: types.array(OrganisationModel)
}

export const SessionStore = types
  .model("SessionStore", SessionStoreModel)
  .actions(self => {
    const {
      apiUrl,
      fetchSingle,
      fetchCollection,
      fetch,
      deleteResource,
      errors
    } = getEnv<StoreEnvironment>(self)

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
        if (self.user!.organisationPrivileges.length > 0) {
          changeSelectedOrganisationOid(
            self.user!.organisationPrivileges[0].oid
          )
        }
        const queryParams = {
          oids: Array.from(
            new Set(
              self.user!.organisationPrivileges.reduce(
                (a, o) => [...a, ...o.childOrganisations, o.oid],
                []
              )
            )
          )
        }
        const organisationsData = yield fetchCollection(
          withQueryString(apiUrl("virkailija/external/organisaatio/find"), {
            ...queryParams
          })
        )
        self.organisations = organisationsData.data.map((o: IOrganisation) => {
          return {
            nimi: o.nimi,
            oid: o.oid
          }
        })
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

    const changeSelectedOrganisationOid = (oid: string) => {
      self.selectedOrganisationOid = oid
    }

    return {
      checkSession,
      login,
      logout,
      resetUserDidLogout,
      changeSelectedOrganisationOid
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
