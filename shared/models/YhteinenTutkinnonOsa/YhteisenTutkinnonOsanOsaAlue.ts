import { types } from "mobx-state-tree"
import { OsaamisenHankkimistapa } from "../OsaamisenHankkimistapa"
import { OsaamisenOsoittaminen } from "../OsaamisenOsoittaminen"
import { HankittavatTutkinnonOsatViews } from "../helpers/HankittavatTutkinnonOsatViews"
import { Organisaatio } from "../Organisaatio"
import { TutkinnonOsaType } from "../helpers/ShareTypes"
import { EnrichOrganisaatioOid } from "../Enrichment/EnrichOrganisaatioOid"
import { OsaAlueVastaus } from "./OsaAlueVastaus"

const Model = types.model("YhteisenTutkinnonOsanOsaAlue", {
  id: types.optional(types.number, 0),
  moduleId: types.maybe(types.string),
  osaAlueKoodiUri: types.optional(types.string, ""),
  osaAlue: types.optional(OsaAlueVastaus, {}),
  osaamisenHankkimistavat: types.array(OsaamisenHankkimistapa),
  vaatimuksistaTaiTavoitteistaPoikkeaminen: types.optional(types.string, ""),
  osaamisenOsoittaminen: types.array(OsaamisenOsoittaminen),
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  koulutuksenJarjestaja: types.maybe(Organisaatio),
  olennainenSeikka: types.optional(types.boolean, false)
})

export const YhteisenTutkinnonOsanOsaAlue = types
  .compose(
    Model,
    EnrichOrganisaatioOid({
      enrichedProperty: "koulutuksenJarjestaja",
      organzationOidProperty: "koulutuksenJarjestajaOid"
    }),
    HankittavatTutkinnonOsatViews
  )
  .views(self => ({
    get otsikko() {
      return self.osaAlue ? self.osaAlue.osaAlueNimi : ""
    },
    get osaamispisteet() {
      return self.osaAlue.laajuus
    },
    get tutkinnonOsaTyyppi(): TutkinnonOsaType {
      return TutkinnonOsaType.HankittavanYhteisenTutkinnonOsanOsaAlue
    }
  }))
