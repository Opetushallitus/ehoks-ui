import { Locale, Translations } from "../../stores/TranslationStore"

export interface LocaleRoot {
  translations: {
    activeLocale: Locale.FI | Locale.SV
    messages: Translations
  }
}
