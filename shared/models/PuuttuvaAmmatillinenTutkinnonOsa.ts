import { types, getRoot } from "mobx-state-tree"
import { HankitunOsaamisenNaytto } from "./HankitunOsaamisenNaytto"
import { OsaamisenHankkimistapa } from "./OsaamisenHankkimistapa"
import { TutkinnonOsaViews } from "./helpers/TutkinnonOsaViews"
import { EnrichKoodiUri } from "models/EnrichKoodiUri"
import { EPerusteetVastaus } from "models/EPerusteetVastaus"
import { LocaleRoot } from "models/helpers/LocaleRoot"

const Model = types.model({
  id: types.optional(types.number, 0),
  tutkinnonOsaKoodiUri: types.optional(types.string, ""),
  tutkinnonOsa: types.optional(EPerusteetVastaus, {}),
  vaatimuksistaTaiTavoitteistaPoikkeaminen: types.optional(types.string, ""),
  hankitunOsaamisenNaytto: types.array(HankitunOsaamisenNaytto),
  osaamisenHankkimistavat: types.array(OsaamisenHankkimistapa),
  koulutuksenJarjestajaOid: types.optional(types.string, "")
})

export const PuuttuvaAmmatillinenTutkinnonOsa = types
  .compose(
    "PuuttuvaAmmatillinenTutkinnonOsa",
    EnrichKoodiUri,
    Model,
    TutkinnonOsaViews
  )
  .views(self => {
    const root: LocaleRoot = getRoot(self)
    return {
      get otsikko() {
        return self.tutkinnonOsa && self.tutkinnonOsa.nimi
          ? self.tutkinnonOsa.nimi[root.translations.activeLocale]
          : ""
      },
      get osaamispisteet() {
        // TODO: get from ePerusteet call
        return 0
      }
    }
  })
