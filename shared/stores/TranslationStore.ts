import { flow, getEnv, Instance, types } from "mobx-state-tree"
import { StoreEnvironment } from "types/StoreEnvironment"
import defaultMessages from "./TranslationStore/defaultMessages.json"
import { APIResponse } from "types/APIResponse"

export interface ApiTranslation {
  key: string
  locale: "fi" | "sv"
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

function mapTranslations(translations: ApiTranslation[]) {
  return translations.map(({ key, locale, value }) => {
    return { key, locale, value }
  })
}

const Lokalisaatio = types.model("LokalisaatioModel", {
  key: types.string,
  locale: types.union(types.literal("fi"), types.literal("sv")),
  value: types.string
})

const TranslationStoreModel = {
  activeLocale: types.optional(
      types.enumeration("ActiveLocale", [Locale.FI, Locale.SV]),
      Locale.FI),
  isLoading: false,
  translations: types.array(Lokalisaatio)
}

export const TranslationStore = types
  .model("TranslationStore", TranslationStoreModel)
  .actions(self => {
    const { apiUrl, apiPrefix, fetchCollection, errors } = getEnv<StoreEnvironment>(self)

    const setActiveLocale = (locale: Locale) => {
      self.activeLocale = locale
    }

    const haeLokalisoinnit = flow(function*(): any {
      self.isLoading = true
      // insert defaultMessages for context.intl.formatMessage calls
      self.translations.replace(defaultMessages as ApiTranslation[])
      try {
        const response: APIResponse = yield fetchCollection(
          apiUrl(`${apiPrefix}/external/lokalisointi`)
        )
        // add custom translations from API
        self.translations.replace([
          ...self.translations,
          ...mapTranslations(response.data)
        ])
      } catch (error) {
        errors.logError("TranslationStore.haeLokalisoinnit", error.message)
      }
      self.isLoading = false
    })

    return { haeLokalisoinnit, setActiveLocale }
  })
  .views(self => {
    return {
      get messages() {
        return self.translations.reduce<Translations>((result, translation) => {
          result[translation.locale] = result[translation.locale] || {}
          result[translation.locale][translation.key] = translation.value
          return result
        }, {})
      }
    }
  })

export interface ITranslationStore extends Instance<typeof TranslationStore> {}
