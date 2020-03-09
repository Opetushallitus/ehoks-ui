import { withQueryString } from "fetchUtils"
import { flow, getEnv, Instance, types } from "mobx-state-tree"
import { APIResponse } from "types/APIResponse"
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
  user: types.maybe(VirkailijaUser),
  selectedOrganisationOid: types.optional(types.string, ""),
  organisations: types.optional(types.array(OrganisationModel), [])
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
      errors,
      callerId
    } = getEnv<StoreEnvironment>(self)

    const login = flow(function*(url: string): any {
      self.isLoading = true
      try {
        const response: APIResponse = yield fetch(url, {
          mode: "no-cors",
          headers: callerId()
        })
        self.user = response.data
      } catch (error) {
        self.error = error.message
      }
      self.isLoading = false
    })

    const checkSession = flow(function*(): any {
      self.isLoading = true
      const storedOid = localStorage.getItem("selectedOrganisationOid")
      if (storedOid) {
        changeSelectedOrganisationOid(storedOid)
      }
      try {
        const response = yield fetchSingle(apiUrl("virkailija/session"), {
          headers: callerId()
        })

        self.user = response.data
        const queryParams = {
          oids: Array.from(
            new Set(
              self.user?.organisationPrivileges.reduce(
                (a, o) => [...a, ...o.childOrganisations!, o.oid],
                []
              )
            )
          )
        }
        const organisationsData = yield fetchCollection(
          withQueryString(apiUrl("virkailija/external/organisaatio/find"), {
            ...queryParams
          }),
          { headers: callerId() }
        )
        self.organisations = organisationsData.data.map((o: IOrganisation) => {
          return {
            nimi: o.nimi,
            oid: o.oid
          }
        })
        if (self.user && self.organisations.length > 0) {
          if (self.organisations.findIndex(p => p.oid === storedOid) === -1) {
            changeSelectedOrganisationOid(self.organisations[0].oid)
          }
        }
      } catch (error) {
        self.error = error.message
      }
      self.isLoading = false
    })

    const logout = flow(function*() {
      self.isLoading = true
      try {
        yield deleteResource(apiUrl("virkailija/session"), {
          headers: callerId()
        })
        self.user = undefined
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
        return !!self.user
      },
      get selectedOrganisation() {
        return (
          self.user &&
          self.user.organisationPrivileges &&
          self.user.organisationPrivileges.find(
            o => o.oid === self.selectedOrganisationOid
          )
        )
      }
    }
  })
  .views(self => {
    return {
      get hasWritePrivilege() {
        return (
          self.selectedOrganisation &&
          self.selectedOrganisation.privileges &&
          self.selectedOrganisation.privileges.indexOf("write") > -1
        )
      },
      get hasSuperUserPrivilege() {
        return (
          self.selectedOrganisation &&
          self.selectedOrganisation.roles.indexOf("oph-super-user") > -1
        )
      }
    }
  })
  .views(self => {
    return {
      get hasEditPrivilege() {
        return self.hasWritePrivilege || self.hasSuperUserPrivilege
      }
    }
  })
export interface ISessionStore extends Instance<typeof SessionStore> {}
