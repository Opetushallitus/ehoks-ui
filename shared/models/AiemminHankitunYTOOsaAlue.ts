import { types } from "mobx-state-tree"
import { OsaamisenOsoittaminen } from "./OsaamisenOsoittaminen"
import { TodennettuArviointiLisatiedot } from "./TodennettuArviointiLisatiedot"
import { EnrichKoodiUri } from "./EnrichKoodiUri"
import { KoodistoVastaus } from "./KoodistoVastaus"
import { AiemminHankitutTutkinnonOsatViews } from "./helpers/AiemminHankitutTutkinnonOsatViews"
import { EnrichOrganisaatioOid } from "./EnrichOrganisaatioOid"
import { Organisaatio } from "./Organisaatio"
import { TutkinnonOsaType } from "./helpers/TutkinnonOsa"

export const Model = types.model("AiemminHankitunYTOOsaAlue", {
  id: types.optional(types.number, 0),
  moduleId: types.maybe(types.string),
  olennainenSeikka: types.optional(types.boolean, false),
  osaAlueKoodiUri: types.optional(types.string, ""),
  osaAlue: types.optional(KoodistoVastaus, {}),
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  koulutuksenJarjestaja: types.maybe(Organisaatio),
  vaatimuksistaTaiTavoitteistaPoikkeaminen: types.optional(types.string, ""),
  valittuTodentamisenProsessiKoodiUri: types.optional(types.string, ""),
  valittuTodentamisenProsessi: types.optional(KoodistoVastaus, {}),
  tarkentavatTiedotNaytto: types.array(OsaamisenOsoittaminen),
  tarkentavatTiedotOsaamisenArvioija: types.optional(
    TodennettuArviointiLisatiedot,
    {}
  )
})

export const AiemminHankitunYTOOsaAlue = types
  .compose(
    EnrichKoodiUri,
    EnrichOrganisaatioOid("koulutuksenJarjestajaOid"),
    AiemminHankitutTutkinnonOsatViews,
    Model
  )
  .views(self => ({
    get otsikko() {
      return self.osaAlue ? self.osaAlue.nimi : ""
    },
    get osaamispisteet() {
      // TODO: where do we get this? Fix this also to YhteisenTutkinnonOsanOsaAlue.ts
      return 0
    },
    get tutkinnonOsaTyyppi(): TutkinnonOsaType {
      return TutkinnonOsaType.AiemminHankitunYhteisenTutkinnonOsanOsaAlue
    },
    get tutkinnonOsaId() {
      return self.moduleId
    }
  }))
