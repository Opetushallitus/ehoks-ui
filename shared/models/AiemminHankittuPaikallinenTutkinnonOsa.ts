import { types } from "mobx-state-tree"
import { getOtsikko } from "./helpers/getOtsikko"
import { OsaamisenOsoittaminen } from "./OsaamisenOsoittaminen"
import { KoodistoVastaus } from "./KoodistoVastaus"
import { EnrichKoodiUri } from "./EnrichKoodiUri"
import { TodennettuArviointiLisatiedot } from "./TodennettuArviointiLisatiedot"
import { AiemminHankitutTutkinnonOsatViews } from "./helpers/AiemminHankitutTutkinnonOsatViews"

const model = types.model({
  id: types.optional(types.number, 0),
  tavoitteetJaSisallot: types.optional(types.string, ""),
  vaatimuksistaTaiTavoitteistaPoikkeaminen: types.optional(types.string, ""),
  nimi: types.optional(types.string, ""),
  laajuus: types.optional(types.number, 0),
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  valittuTodentamisenProsessiKoodiUri: types.optional(types.string, ""),
  valittuTodentamisenProsessi: types.optional(KoodistoVastaus, {}),
  tarkentavatTiedotNaytto: types.array(OsaamisenOsoittaminen),
  tarkentavatTiedotOsaamisenArvioija: types.optional(TodennettuArviointiLisatiedot, {}),
  amosaaTunniste: types.optional(types.string, ""),
  olennainenSeikka: types.optional(types.boolean, false)
})

export const AiemminHankittuPaikallinenTutkinnonOsa = types.compose(
  "AiemminHankittuPaikallinenTutkinnonOsa",
  EnrichKoodiUri,
  AiemminHankitutTutkinnonOsatViews,
  model
).views(self => {
  return {
    get otsikko() {
      return self.nimi
    },
    get osaamispisteet() {
      return self.laajuus
    },
    get todentamisenProsessi() {
      return {
        koodiUri: self.valittuTodentamisenProsessiKoodiUri,
        lahetettyArvioitavaksi:
        self.tarkentavatTiedotOsaamisenArvioija.lahetettyArvioitavaksi
      }
    },
    opintoOtsikko(ospLyhenne: string): string {
      return getOtsikko(this, ospLyhenne)
    }
  }
})