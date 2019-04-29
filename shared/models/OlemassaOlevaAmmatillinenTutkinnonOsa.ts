import { types, getRoot } from "mobx-state-tree"
import { HankitunOsaamisenNaytto } from "./HankitunOsaamisenNaytto"
import { TodennettuArviointiLisatiedot } from "./TodennettuArviointiLisatiedot"
import { getNaytot } from "./helpers/getNaytot"
import { getOtsikko } from "./helpers/getOtsikko"
import { EnrichKoodiUri } from "models/EnrichKoodiUri"
import { EPerusteetVastaus } from "models/EPerusteetVastaus"
import { LocaleRoot } from "models/helpers/LocaleRoot"
import { getOsaamispisteet } from "models/helpers/getOsaamispisteet"
import { EnrichTutkinnonOsa } from "models/EnrichTutkinnonOsa"
import { TutkinnonOsaViite } from "models/TutkinnonOsaViite"
import { KoodistoVastaus } from "models/KoodistoVastaus"

const Model = types.model({
  id: types.optional(types.number, 0),
  tutkinnonOsaKoodiUri: types.optional(types.string, ""),
  tutkinnonOsa: types.optional(EPerusteetVastaus, {}),
  tutkinnonOsaViitteet: types.array(TutkinnonOsaViite),
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  valittuTodentamisenProsessiKoodiUri: types.optional(types.string, ""),
  valittuTodentamisenProsessi: types.optional(KoodistoVastaus, {}),
  tarkentavatTiedotNaytto: types.array(HankitunOsaamisenNaytto),
  tarkentavatTiedotArvioija: types.optional(TodennettuArviointiLisatiedot, {})
})

export const OlemassaOlevaAmmatillinenTutkinnonOsa = types
  .compose(
    "OlemassaOlevaAmmatillinenTutkinnonOsa",
    EnrichKoodiUri,
    EnrichTutkinnonOsa("tutkinnonOsaViitteet"),
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
      get naytot() {
        return getNaytot(self.tarkentavatTiedotNaytto)
      },
      get todentamisenProsessi() {
        return {
          koodiUri: self.valittuTodentamisenProsessiKoodiUri,
          lahetettyArvioitavaksi:
            self.tarkentavatTiedotArvioija.lahetettyArvioitavaksi
        }
      },
      opintoOtsikko(ospLyhenne: string): string {
        return getOtsikko(this, ospLyhenne)
      }
    }
  })
