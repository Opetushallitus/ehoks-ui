import { types, getRoot } from "mobx-state-tree"
import { LocaleRoot } from "models/helpers/LocaleRoot"

const KoodistoMetadata = types.model("KoodistoMetadata", {
  kuvaus: types.maybeNull(types.string),
  kasite: types.maybeNull(types.string),
  lyhytNimi: types.maybeNull(types.string),
  eiSisallaMerkitysta: types.maybeNull(types.string),
  kieli: types.optional(types.string, ""),
  nimi: types.optional(types.string, ""),
  sisaltaaMerkityksen: types.maybeNull(types.string),
  huomioitavaKoodi: types.maybeNull(types.string),
  kayttoohje: types.maybeNull(types.string),
  sisaltaaKoodiston: types.maybeNull(types.string)
})

export const KoodistoVastaus = types
  .model("KoodistoVastaus", {
    fi: types.optional(KoodistoMetadata, {}),
    sv: types.optional(KoodistoMetadata, {})
  })
  .views(self => {
    const root: LocaleRoot = getRoot(self)
    return {
      get nimi() {
        return self[root.translations.activeLocale].nimi
          ? self[root.translations.activeLocale].nimi
          : ""
      }
    }
  })
