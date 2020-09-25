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
          contactValuesGroup: [
            {
              contact: [
                {
                  type: "YHTEYSTIETO_SAHKOPOSTI",
                  value: "kayttaja@domain.local"
                }
              ],
              id: 0
            }
          ],
          firstName: "Teuvo Taavetti",
          fullName: "",
          oid: "1.1.111.111.11.111111111",
          surname: "Testaaja"
        })
        done()
      }
    )
  })

  test("logout", () => {
    const store = SessionStore.create(
      {
        user: {
          firstName: "Teuvo Taavetti",
          surname: "Testaaja"
        }
      },
      createEnvironment(mockFetch(apiUrl, 2), apiUrl, "", callerId)
    )
    expect(store.user).toEqual({
      contactValuesGroup: [],
      firstName: "Teuvo Taavetti",
      fullName: "",
      oid: "",
      surname: "Testaaja"
    })

    store.logoutOppija()
    expect(store.isLoading).toBe(true)

    when(
      () => !store.isLoading,
      () => {
        expect(store.user).toBeUndefined()
      }
    )
  })
})
