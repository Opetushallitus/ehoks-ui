import { withQueryString } from "fetchUtils"
import { flow, getEnv, getParent, Instance, types } from "mobx-state-tree"
import { IOrganisation, OrganisationModel } from "types/Organisation"
import { StoreEnvironment } from "types/StoreEnvironment"

export const OrganisationPrivilege = types.model("OrganisationPrivilege", {
  oid: types.string,
  privileges: types.array(types.string),
  roles: types.array(types.string),
  childOrganisations: types.array(types.string)
})

export const VirkailijaUser = types
  .model("VirkailijaUser", {
    oidHenkilo: types.string,
    isSuperuser: types.boolean,
    organisationPrivileges: types.array(OrganisationPrivilege)
  })
  .views(self => ({
    get hasWritePrivilege(): boolean {
      const oid = getParent<ISessionStore>(self).selectedOrganisationOid
      return !!self.organisationPrivileges
        ?.find(o => o.oid === oid)
        ?.privileges.includes("write")
    },
    get hasSuperUserPrivilege(): boolean {
      const selectedOrganisation = getParent<ISessionStore>(self)
        .selectedOrganisation
      return !!selectedOrganisation?.roles.includes("oph-super-user")
    },
    get hasShallowDeletePrivilege(): boolean {
      const sessionStore = getParent<ISessionStore>(self)
      return (
        self.isSuperuser ||
        !!sessionStore.selectedOrganisationChildOrganisationsIncluded?.privileges.includes(
          "hoks_delete"
        )
      )
    }
  }))
  .views(self => ({
    get hasEditPrivilege() {
      return self.hasWritePrivilege || self.hasSuperUserPrivilege
    }
  }))

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
      deleteResource,
      errors,
      appendCallerId
    } = getEnv<StoreEnvironment>(self)

    const checkSession = flow(function*(): any {
      self.isLoading = true
      const storedOid = localStorage.getItem("selectedOrganisationOid")
      if (storedOid) {
        changeSelectedOrganisationOid(storedOid)
      }
      try {
        const response = yield fetchSingle(apiUrl("virkailija/session"), {
          headers: appendCallerId()
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
          { headers: appendCallerId() }
        )
        self.organisations = organisationsData.data.map((o: IOrganisation) => ({
          nimi: o.nimi,
          oid: o.oid
        }))
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

    const logoutVirkailija = flow(function*() {
      self.isLoading = true
      try {
        yield deleteResource(apiUrl("virkailija/session"), {
          headers: appendCallerId()
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
      logoutVirkailija,
      resetUserDidLogout,
      changeSelectedOrganisationOid
    }
  })
  .views(self => ({
    get isLoggedIn() {
      return !!self.user
    },
    get selectedOrganisation() {
      return self.user?.organisationPrivileges.find(
        o => o.oid === self.selectedOrganisationOid
      )
    }
  }))
  .views(self => ({
    get selectedOrganisationChildOrganisationsIncluded() {
      return (
        self.selectedOrganisation ||
        self.user?.organisationPrivileges.find(o =>
          o.childOrganisations.includes(self.selectedOrganisationOid)
        )
      )
    }
  }))

export type ISessionStore = Instance<typeof SessionStore>
