import { types } from "mobx-state-tree"
import { OsaamisenOsoittaminen } from "./OsaamisenOsoittaminen"
import { TodennettuArviointiLisatiedot } from "./TodennettuArviointiLisatiedot"
import { TutkinnonOsaViews } from "./helpers/TutkinnonOsaViews"
import { EnrichKoodiUri } from "./EnrichKoodiUri"
import { KoodistoVastaus } from "./KoodistoVastaus"
import { getOtsikko } from "./helpers/getOtsikko"

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
    Model,
    TutkinnonOsaViews
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
      opintoOtsikko(ospLyhenne: string): string {
        return getOtsikko(this, ospLyhenne)
      }
    }
  })



