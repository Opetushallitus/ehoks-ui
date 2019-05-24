import { mockFetch } from "fetchUtils"
import { when } from "mobx"
import { TranslationStore } from "../TranslationStore"
import lokalisointi from "../mocks/lokalisointi0.json"
import defaultMessages from "../TranslationStore/defaultMessages.json"
import { createEnvironment } from "createEnvironment"

const apiUrl = (path: string) => `/${path}`

describe("TranslationStore", () => {
  test("haeLokalisoinnit fetches both defaultMessages and API translations", () => {
    const store = TranslationStore.create(
      {},
      createEnvironment(mockFetch(apiUrl), apiUrl, "")
    )

    expect(store.isLoading).toBe(false)
    expect(store.translations).toEqual([])
    expect(store.activeLocale).toEqual("fi")

    store.haeLokalisoinnit(apiUrl)
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
      createEnvironment(mockFetch(apiUrl), apiUrl, "")
    )
    store.haeLokalisoinnit(apiUrl)
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
