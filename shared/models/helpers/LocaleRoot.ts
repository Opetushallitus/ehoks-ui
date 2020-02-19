import { Locale } from "../../stores/TranslationStore"

export interface LocaleRoot {
  translations: {
    activeLocale: Locale.FI | Locale.SV
  }
}
