import { types } from "mobx-state-tree"
import { OsaamisenOsoittaminen } from "./OsaamisenOsoittaminen"
import { TodennettuArviointiLisatiedot } from "./TodennettuArviointiLisatiedot"
import { EnrichKoodiUri } from "./EnrichKoodiUri"
import { KoodistoVastaus } from "./KoodistoVastaus"
import { getOtsikko } from "./helpers/getOtsikko"
import { Naytto } from "./helpers/TutkinnonOsa"
import { getNaytot } from "./helpers/getNaytot"

export const Model = types.model(
  "AiemminHankitunYTOOsaAlue", {
    id: types.optional(types.number, 0),
    olennainenSeikka: types.optional(types.boolean, false),
    osaAlueKoodiUri: types.optional(types.string, ""),
    osaAlue: types.optional(KoodistoVastaus, {}),
    koulutuksenJarjestajaOid: types.optional(types.string, ""),
    vaatimuksistaTaiTavoitteistaPoikkeaminen: types.optional(types.string, ""),
    valittuTodentamisenProsessiKoodiUri: types.optional(types.string, ""),
    valittuTodentamisenProsessi: types.optional(KoodistoVastaus, {}),
    tarkentavatTiedotNaytto: types.array(OsaamisenOsoittaminen),
    tarkentavatTiedotArvioija: types.optional(TodennettuArviointiLisatiedot, {})
  }
)

export const AiemminHankitunYTOOsaAlue = types
  .compose(
    EnrichKoodiUri,
    Model
  )
  .views(self => {
    return {
      get otsikko() {
        return self.osaAlue ? self.osaAlue.nimi : ""
      },
      get osaamispisteet() {
        // TODO: where do we get this?
        return 0
      },
      get naytot(): Naytto[] {
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



