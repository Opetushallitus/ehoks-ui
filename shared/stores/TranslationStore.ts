import { flow, getEnv, Instance, types } from "mobx-state-tree"
import { StoreEnvironment } from "types/StoreEnvironment"
import defaultMessages from "./TranslationStore/defaultMessages.json"
import { APIResponse } from "types/APIResponse"
import { updateLocaleSessionStorage } from "localeUtils"

export interface ApiTranslation {
  key: string
  locale: Locale.FI | Locale.SV
  value: string
}

export interface Translations {
  [locale: string]: {
    [key: string]: string
  }
}

export enum Locale {
  FI = "fi",
  SV = "sv"
}

const mapTranslations = (translations: ApiTranslation[]) =>
  translations.map(({ key, locale, value }) => ({ key, locale, value }))

const Localization = types.model("LocalizationModel", {
  key: types.string,
  locale: types.union(types.literal(Locale.FI), types.literal(Locale.SV)),
  value: types.string
})

const TranslationStoreModel = {
  activeLocale: types.optional(
    types.enumeration("ActiveLocale", [Locale.FI, Locale.SV]),
    Locale.FI
  ),
  isLoading: false,
  translations: types.array(Localization)
}

export const TranslationStore = types
  .model("TranslationStore", TranslationStoreModel)
  .actions(self => {
    const { apiUrl, apiPrefix, fetchCollection, errors, appendCallerId } =
      getEnv<StoreEnvironment>(self)

    const setActiveLocale = (locale: Locale) => {
      const storedLocale = updateLocaleSessionStorage(locale)
      self.activeLocale = storedLocale ? storedLocale : locale
    }

    const fetchLocales = flow(function* (): any {
      self.isLoading = true
      // insert defaultMessages for context.intl.formatMessage calls
      self.translations.replace(defaultMessages as ApiTranslation[])
      try {
        const response: APIResponse = yield fetchCollection(
          apiUrl(`${apiPrefix}/external/lokalisointi`),
          { headers: appendCallerId() }
        )
        // add custom translations from API
        self.translations.replace([
          ...self.translations,
          ...mapTranslations(response.data)
        ])
      } catch (error) {
        errors.logError("TranslationStore.fetchLocales", error.message)
      }
      self.isLoading = false
    })

    return { fetchLocales, setActiveLocale }
  })
  .views(self => ({
    get messages() {
      return self.translations.reduce<Translations>((result, translation) => {
        result[translation.locale] = result[translation.locale] || {}
        result[translation.locale][translation.key] = translation.value
        return result
      }, {})
    }
  }))

export type ITranslationStore = Instance<typeof TranslationStore>
