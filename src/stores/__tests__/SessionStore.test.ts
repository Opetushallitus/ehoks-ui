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
        expect(store.session.loginUrl).toBe(
          "http://localhost:3000/auth-dev/opintopolku-login/"
        )
      }
    )
  })

  test("checkSession with login", () => {
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
          firstName: "Teuvo Taavetti",
          surname: "Testaaja"
        })
        expect(store.session.loginUrl).toBe(
          "http://localhost:3000/auth-dev/opintopolku-login/"
        )
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
      firstName: "Teuvo Taavetti",
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
