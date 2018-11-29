import { apiUrl } from "config"
import { flow, getEnv, Instance, types } from "mobx-state-tree"
import { IStoreEnvironment } from "utils"
import defaultMessages from "./TranslationStore/defaultMessages.json"

export interface ApiTranslation {
  key: string
  locale: "fi" | "sv"
  value: string
}

interface Translations {
  [locale: string]: {
    [key: string]: string
  }
}

function mapTranslations(translations: any) {
  return translations.map(({ key, locale, value }: ApiTranslation) => {
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
    types.union(types.literal("fi"), types.literal("sv")),
    "fi"
  ),
  isLoading: false,
  translations: types.array(Lokalisaatio)
}

export const TranslationStore = types
  .model("TranslationStore", TranslationStoreModel)
  .actions(self => {
    const { fetchCollection, errors } = getEnv<IStoreEnvironment>(self)

    const setActiveLocale = (locale: "fi" | "sv") => {
      self.activeLocale = locale
    }

    const haeLokalisoinnit = flow(function*(): any {
      self.isLoading = true
      // insert defaultMessages for context.intl.formatMessage calls
      self.translations.replace(defaultMessages as ApiTranslation[])
      try {
        const response = yield fetchCollection(apiUrl("lokalisointi"))
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
          return {
            ...result,
            [translation.locale]: {
              ...result[translation.locale],
              [translation.key]: translation.value
            }
          }
        }, {})
      }
    }
  })

export interface ITranslationStore extends Instance<typeof TranslationStore> {}
