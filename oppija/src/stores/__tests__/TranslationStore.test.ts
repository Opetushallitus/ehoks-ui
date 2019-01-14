import { when } from "mobx"
import { TranslationStore } from "stores/TranslationStore"
import { fetchUtils, mockFetch } from "utils"
import lokalisointi from "../mocks/lokalisointi0.json"
import defaultMessages from "../TranslationStore/defaultMessages.json"

describe("TranslationStore", () => {
  test("haeLokalisoinnit fetches both defaultMessages and API translations", () => {
    const { fetchCollection, fetchSingle, deleteResource } = fetchUtils(
      mockFetch()
    )
    const store = TranslationStore.create(
      {},
      { fetchCollection, fetchSingle, deleteResource }
    )

    expect(store.isLoading).toBe(false)
    expect(store.translations).toEqual([])
    expect(store.activeLocale).toEqual("fi")

    store.haeLokalisoinnit()
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
    const { fetchCollection, fetchSingle, deleteResource } = fetchUtils(
      mockFetch()
    )
    const store = TranslationStore.create(
      {},
      { fetchCollection, fetchSingle, deleteResource }
    )
    store.haeLokalisoinnit()
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
