import { when } from "mobx"
import { SessionStore } from "stores/SessionStore"
import { fetchUtils, mockFetch } from "utils"

describe("SessionStore", () => {
  test("checkSession without login", () => {
    const { fetchCollection, fetchSingle, deleteResource } = fetchUtils(
      mockFetch()
    )
    const store = SessionStore.create(
      {},
      { fetchCollection, fetchSingle, deleteResource }
    )

    expect(store.isLoading).toBe(false)
    expect(store.user).toEqual(null)

    store.checkSession()
    expect(store.isLoading).toBe(true)

    when(
      () => !store.isLoading,
      () => {
        expect(store.user).toEqual(null)
      }
    )
  })

  test("checkSession with login", done => {
    const { fetchCollection, fetchSingle, deleteResource } = fetchUtils(
      mockFetch(1)
    )
    const store = SessionStore.create(
      {},
      { fetchCollection, fetchSingle, deleteResource }
    )

    expect(store.isLoading).toBe(false)
    expect(store.user).toEqual(null)

    store.checkSession()
    expect(store.isLoading).toBe(true)

    when(
      () => !store.isLoading,
      () => {
        expect(store.user).toEqual({
          commonName: "Teuvo",
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
          oid: "1.1.111.111.11.111111111",
          surname: "Testaaja"
        })
        done()
      }
    )
  })

  test("logout", () => {
    const { fetchCollection, fetchSingle, deleteResource } = fetchUtils(
      mockFetch(2)
    )
    const store = SessionStore.create(
      {
        user: {
          commonName: "Teuvo",
          firstName: "Teuvo Taavetti",
          surname: "Testaaja"
        }
      },
      { fetchCollection, fetchSingle, deleteResource }
    )
    expect(store.user).toEqual({
      commonName: "Teuvo",
      contactValuesGroup: [],
      firstName: "Teuvo Taavetti",
      oid: "",
      surname: "Testaaja"
    })

    store.logout()
    expect(store.isLoading).toBe(true)

    when(
      () => !store.isLoading,
      () => {
        expect(store.user).toEqual(null)
      }
    )
  })
})
