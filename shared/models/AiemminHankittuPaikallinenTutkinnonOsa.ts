import { types } from "mobx-state-tree"
import { OsaamisenOsoittaminen } from "./OsaamisenOsoittaminen"
import { TodennettuArviointiLisatiedot } from "./TodennettuArviointiLisatiedot"
import { AiemminHankitutTutkinnonOsatViews } from "./helpers/AiemminHankitutTutkinnonOsatViews"
import { Organisaatio } from "./Organisaatio"
import { TutkinnonOsaType } from "./helpers/ShareTypes"
import { EnrichOrganisaatioOid } from "./Enrichment/EnrichOrganisaatioOid"

const model = types.model({
  id: types.optional(types.number, 0),
  moduleId: types.maybe(types.string),
  tavoitteetJaSisallot: types.optional(types.string, ""),
  vaatimuksistaTaiTavoitteistaPoikkeaminen: types.optional(types.string, ""),
  nimi: types.optional(types.string, ""),
  laajuus: types.optional(types.number, 0),
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  koulutuksenJarjestaja: types.maybe(Organisaatio),
  valittuTodentamisenProsessiKoodiUri: types.optional(types.string, ""),
  tarkentavatTiedotNaytto: types.array(OsaamisenOsoittaminen),
  tarkentavatTiedotOsaamisenArvioija: types.optional(
    TodennettuArviointiLisatiedot,
    {}
  ),
  amosaaTunniste: types.optional(types.string, ""),
  olennainenSeikka: types.optional(types.boolean, false)
})

export const AiemminHankittuPaikallinenTutkinnonOsa = types
  .compose(
    "AiemminHankittuPaikallinenTutkinnonOsa",
    EnrichOrganisaatioOid({
      enrichedProperty: "koulutuksenJarjestaja",
      organzationOidProperty: "koulutuksenJarjestajaOid"
    }),
    AiemminHankitutTutkinnonOsatViews,
    model
  )
  .views(self => ({
    get otsikko() {
      return self.nimi
    },
    get osaamispisteet() {
      return self.laajuus
    },
    get tutkinnonOsaTyyppi(): TutkinnonOsaType {
      return TutkinnonOsaType.AiemminHankittuPaikallinen
    },
    get tutkinnonOsaId() {
      return self.moduleId
    }
  }))
