import { mockFetch } from "fetchUtils"
import { when } from "mobx"
import { TranslationStore } from "../TranslationStore"
import lokalisointi from "../mocks/_external_lokalisointi0.json"
import defaultMessages from "../TranslationStore/defaultMessages.json"
import { createEnvironment } from "createEnvironment"

const apiUrl = (path: string) => `/${path}`
const callerId = (headers?: Headers) => (headers ? headers : new Headers())

describe("TranslationStore", () => {
  test("fetchLocales fetches both defaultMessages and API translations", () => {
    const store = TranslationStore.create(
      {},
      createEnvironment(mockFetch(apiUrl), apiUrl, "", callerId)
    )

    expect(store.isLoading).toBe(false)
    expect(store.translations).toEqual([])
    expect(store.activeLocale).toEqual("fi")

    store.fetchLocales()

    expect(store.isLoading).toBe(true)

    when(
      () => !store.isLoading,
      () => {
        expect(store.translations.length).toEqual(
          defaultMessages.length + lokalisointi.data.length
        )
      }
    )
  })

  test("messages view returns translations in a format suitable for react-intl", () => {
    const store = TranslationStore.create(
      {},
      createEnvironment(mockFetch(apiUrl), apiUrl, "", callerId)
    )

    store.fetchLocales()

    when(
      () => !store.isLoading,
      () => {
        const finnishTranslations = store.messages.fi
        expect(Object.keys(finnishTranslations).length).toEqual(
          defaultMessages.length + lokalisointi.data.length
        )
        expect(finnishTranslations["opiskelusuunnitelma.nayttoTitle"]).toEqual(
          "Näyttö"
        )
        expect(finnishTranslations["errors.piilotaVirheAriaLabel"]).toEqual(
          "Piilota virhe"
        )
      }
    )
  })
})
