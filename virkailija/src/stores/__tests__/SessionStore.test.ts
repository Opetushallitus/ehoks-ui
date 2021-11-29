import { apiUrl } from "config"
import { createEnvironment } from "createEnvironment"
import { mockFetch } from "fetchUtils"
import { when } from "mobx"
import { SessionStore } from "stores/SessionStore"

const callerId = (headers?: Headers) => (headers ? headers : new Headers())

describe("SessionStore", () => {
  test("checkSession without login", () => {
    const store = SessionStore.create(
      {},
      createEnvironment(mockFetch(apiUrl), apiUrl, "", callerId)
    )

    expect(store.isLoading).toBe(false)
    expect(store.user).toBeUndefined()

    store.checkSession()
    expect(store.isLoading).toBe(true)

    when(
      () => !store.isLoading,
      () => {
        expect(store.user).toBeUndefined()
      }
    )
  })

  test("checkSession with login", done => {
    const store = SessionStore.create(
      {},
      createEnvironment(mockFetch(apiUrl, 1), apiUrl, "", callerId)
    )

    expect(store.isLoading).toBe(false)
    expect(store.user).toBeUndefined()

    store.checkSession()
    expect(store.isLoading).toBe(true)

    when(
      () => !store.isLoading,
      () => {
        expect(store.user).toEqual({
          oidHenkilo: "1.1.111.111.11.11111111111",
          isSuperuser: false,
          organisationPrivileges: [
            {
              oid: "1.1.111.111.11.11111111112",
              privileges: ["read", "update", "delete", "write"],
              roles: [],
              childOrganisations: []
            },
            {
              oid: "1.1.111.111.11.11111111113",
              privileges: ["read"],
              roles: [],
              childOrganisations: []
            }
          ]
        })
        done()
      }
    )
  })

  test("logout", () => {
    const store = SessionStore.create(
      {
        user: {
          oidHenkilo: "1.1.111.111.11.11111111111",
          isSuperuser: false,
          organisationPrivileges: [
            {
              oid: "1.1.111.111.11.11111111112",
              privileges: ["read", "update", "delete", "write"],
              roles: [],
              childOrganisations: []
            }
          ]
        }
      },
      createEnvironment(mockFetch(apiUrl, 2), apiUrl, "", callerId)
    )
    expect(store.user).toEqual({
      oidHenkilo: "1.1.111.111.11.11111111111",
      isSuperuser: false,
      organisationPrivileges: [
        {
          oid: "1.1.111.111.11.11111111112",
          privileges: ["read", "update", "delete", "write"],
          roles: [],
          childOrganisations: []
        }
      ]
    })

    store.logoutVirkailija()
    expect(store.isLoading).toBe(true)

    when(
      () => !store.isLoading,
      () => {
        expect(store.user).toBeUndefined()
      }
    )
  })
})
