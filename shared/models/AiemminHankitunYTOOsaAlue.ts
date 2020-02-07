import { types } from "mobx-state-tree"
import { OsaamisenOsoittaminen } from "./OsaamisenOsoittaminen"
import { TodennettuArviointiLisatiedot } from "./TodennettuArviointiLisatiedot"
import { EnrichKoodiUri } from "./EnrichKoodiUri"
import { KoodistoVastaus } from "./KoodistoVastaus"
import { AiemminHankitutTutkinnonOsatViews } from "./helpers/AiemminHankitutTutkinnonOsatViews"

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
    tarkentavatTiedotOsaamisenArvioija: types.optional(TodennettuArviointiLisatiedot, {})
  }
)

export const AiemminHankitunYTOOsaAlue = types
  .compose(
    EnrichKoodiUri,
    AiemminHankitutTutkinnonOsatViews,
    Model
  )
  .views(self => {
    return {
      get otsikko() {
        return self.osaAlue ? self.osaAlue.nimi : ""
      },
      get osaamispisteet() {
        // TODO: where do we get this? Fix this also to YhteisenTutkinnonOsanOsaAlue.ts
        return 0
      }
    }
  })



