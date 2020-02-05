import { types, getRoot } from "mobx-state-tree"
import { OsaamisenOsoittaminen } from "./OsaamisenOsoittaminen"
import { TodennettuArviointiLisatiedot } from "./TodennettuArviointiLisatiedot"
import { getOtsikko } from "./helpers/getOtsikko"
import { EnrichKoodiUri } from "models/EnrichKoodiUri"
import { EPerusteetVastaus } from "models/EPerusteetVastaus"
import { LocaleRoot } from "models/helpers/LocaleRoot"
import { getOsaamispisteet } from "models/helpers/getOsaamispisteet"
import { EnrichTutkinnonOsa } from "models/EnrichTutkinnonOsa"
import { TutkinnonOsaViite } from "models/TutkinnonOsaViite"
import { KoodistoVastaus } from "models/KoodistoVastaus"
import { AiemminHankitutTutkinnonOsatViews } from "./helpers/AiemminHankitutTutkinnonOsatViews"

const Model = types.model({
  id: types.optional(types.number, 0),
  tutkinnonOsaKoodiUri: types.optional(types.string, ""),
  tutkinnonOsa: types.optional(EPerusteetVastaus, {}),
  tutkinnonOsaViitteet: types.array(TutkinnonOsaViite),
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  valittuTodentamisenProsessiKoodiUri: types.optional(types.string, ""),
  valittuTodentamisenProsessi: types.optional(KoodistoVastaus, {}),
  tarkentavatTiedotNaytto: types.array(OsaamisenOsoittaminen),
  tarkentavatTiedotOsaamisenArvioija: types.optional(TodennettuArviointiLisatiedot, {}),
  olennainenSeikka: types.optional(types.boolean, false)
})

export const AiemminHankittuAmmatillinenTutkinnonOsa = types
  .compose(
    "AiemminHankittuAmmatillinenTutkinnonOsa",
    EnrichKoodiUri,
    EnrichTutkinnonOsa("tutkinnonOsaViitteet"),
    AiemminHankitutTutkinnonOsatViews,
    Model
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
        return getOsaamispisteet(self.tutkinnonOsaViitteet)
      },
      get todentamisenProsessi() {
        return {
          koodiUri: self.valittuTodentamisenProsessiKoodiUri,
          lahetettyArvioitavaksi:
            self.tarkentavatTiedotOsaamisenArvioija.lahetettyArvioitavaksi
        }
      }
    }
  })
  .views(self => ({
    opintoOtsikko(ospLyhenne: string): string {
      return getOtsikko(self, ospLyhenne)
    }
  }))
