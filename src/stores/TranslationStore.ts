import { apiUrl } from "config"
import { flow, getRoot, Instance, types } from "mobx-state-tree"
import { RootStore } from "stores/RootStore"

interface ApiTranslation {
  key: string
  locale: string
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

const Translation = types.model("Translation", {
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
  translations: types.optional(types.array(Translation), [])
}

export const TranslationStore = types
  .model("TranslationStore", TranslationStoreModel)
  .actions(self => {
    const root = getRoot<Instance<typeof RootStore>>(self)

    const setActiveLocale = (locale: "fi" | "sv") => {
      self.activeLocale = locale
    }

    const fetchTranslations = flow(function*(): any {
      self.isLoading = true
      const response = yield root.fetchCollection(apiUrl("localization"))
      self.translations = mapTranslations(response.data)
      self.isLoading = false
    })

    return { fetchTranslations, setActiveLocale }
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
