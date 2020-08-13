import { types } from "mobx-state-tree"
import { OsaamisenOsoittaminen } from "../OsaamisenOsoittaminen"
import { TodennettuArviointiLisatiedot } from "../TodennettuArviointiLisatiedot"
import { AiemminHankitutTutkinnonOsatViews } from "../helpers/AiemminHankitutTutkinnonOsatViews"
import { Organisaatio } from "../Organisaatio"
import { TutkinnonOsaType } from "../helpers/ShareTypes"
import { EnrichOrganisaatioOid } from "../Enrichment/EnrichOrganisaatioOid"
import { OsaAlueVastaus } from "./OsaAlueVastaus"

export const Model = types.model("AiemminHankitunYTOOsaAlue", {
  id: types.optional(types.number, 0),
  moduleId: types.maybe(types.string),
  olennainenSeikka: types.optional(types.boolean, false),
  osaAlueKoodiUri: types.optional(types.string, ""),
  osaAlue: types.optional(OsaAlueVastaus, {}),
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  koulutuksenJarjestaja: types.maybe(Organisaatio),
  vaatimuksistaTaiTavoitteistaPoikkeaminen: types.optional(types.string, ""),
  valittuTodentamisenProsessiKoodiUri: types.optional(types.string, ""),
  tarkentavatTiedotNaytto: types.array(OsaamisenOsoittaminen),
  tarkentavatTiedotOsaamisenArvioija: types.optional(
    TodennettuArviointiLisatiedot,
    {}
  )
})

export const AiemminHankitunYTOOsaAlue = types
  .compose(
    EnrichOrganisaatioOid({
      enrichedProperty: "koulutuksenJarjestaja",
      organzationOidProperty: "koulutuksenJarjestajaOid"
    }),
    AiemminHankitutTutkinnonOsatViews,
    Model
  )
  .views(self => ({
    get otsikko() {
      return self.osaAlue ? self.osaAlue.osaAlueNimi : ""
    },
    get osaamispisteet() {
      return self.osaAlue.laajuus
    },
    get tutkinnonOsaTyyppi(): TutkinnonOsaType {
      return TutkinnonOsaType.AiemminHankitunYhteisenTutkinnonOsanOsaAlue
    },
    get tutkinnonOsaId() {
      return self.moduleId
    }
  }))
