import { types } from "mobx-state-tree"
import { OsaamisenOsoittaminen } from "./OsaamisenOsoittaminen"
import { KoodistoVastaus } from "./KoodistoVastaus"
import { EnrichKoodiUri } from "./EnrichKoodiUri"
import { TodennettuArviointiLisatiedot } from "./TodennettuArviointiLisatiedot"
import { AiemminHankitutTutkinnonOsatViews } from "./helpers/AiemminHankitutTutkinnonOsatViews"
import { Organisaatio } from "./Organisaatio"
import { EnrichOrganisaatioOid } from "./EnrichOrganisaatioOid"

const model = types.model({
  id: types.optional(types.number, 0),
  tavoitteetJaSisallot: types.optional(types.string, ""),
  vaatimuksistaTaiTavoitteistaPoikkeaminen: types.optional(types.string, ""),
  nimi: types.optional(types.string, ""),
  laajuus: types.optional(types.number, 0),
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  koulutuksenJarjestaja: types.maybe(Organisaatio),
  valittuTodentamisenProsessiKoodiUri: types.optional(types.string, ""),
  valittuTodentamisenProsessi: types.optional(KoodistoVastaus, {}),
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
    EnrichKoodiUri,
    EnrichOrganisaatioOid("koulutuksenJarjestajaOid"),
    AiemminHankitutTutkinnonOsatViews,
    model
  )
  .views(self => {
    return {
      get otsikko() {
        return self.nimi
      },
      get osaamispisteet() {
        return self.laajuus
      }
    }
  })
