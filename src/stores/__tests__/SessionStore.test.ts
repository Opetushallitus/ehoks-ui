import { when } from "mobx"
import { mockFetch } from "../../utils"
import { RootStore } from "../RootStore"

describe("SessionStore", () => {
  test("checkSession without login", () => {
    const store = RootStore.create({}, { fetch: mockFetch() })

    expect(store.session.isLoading).toBe(false)
    expect(store.session.user).toEqual(null)

    store.session.checkSession()
    expect(store.session.isLoading).toBe(true)

    when(
      () => !store.session.isLoading,
      () => {
        expect(store.session.user).toEqual(null)
      }
    )
  })

  test("checkSession with login", done => {
    const store = RootStore.create({}, { fetch: mockFetch(1) })

    expect(store.session.isLoading).toBe(false)
    expect(store.session.user).toEqual(null)

    store.session.checkSession()
    expect(store.session.isLoading).toBe(true)

    when(
      () => !store.session.isLoading,
      () => {
        expect(store.session.user).toEqual({
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
    const store = RootStore.create(
      {
        session: {
          user: {
            commonName: "Teuvo",
            firstName: "Teuvo Taavetti",
            surname: "Testaaja"
          }
        }
      },
      { fetch: mockFetch(2) }
    )
    expect(store.session.user).toEqual({
      commonName: "Teuvo",
      contactValuesGroup: [],
      firstName: "Teuvo Taavetti",
      oid: "",
      surname: "Testaaja"
    })

    store.session.logout()
    expect(store.session.isLoading).toBe(true)

    when(
      () => !store.session.isLoading,
      () => {
        expect(store.session.user).toEqual(null)
      }
    )
  })
})
