import { types } from "mobx-state-tree"
import { OsaamisenHankkimistapa } from "./OsaamisenHankkimistapa"
import { OsaamisenOsoittaminen } from "./OsaamisenOsoittaminen"
import { HankittavatTutkinnonOsatViews } from "./helpers/HankittavatTutkinnonOsatViews"
import { Organisaatio } from "./Organisaatio"
import { TutkinnonOsaType } from "./helpers/ShareTypes"
import { EnrichOrganisaatioOid } from "./Enrichment/EnrichOrganisaatioOid"

const Model = types.model("HankittavaPaikallinenTutkinnonOsaModel", {
  id: types.optional(types.number, 0),
  moduleId: types.maybe(types.string),
  tavoitteetJaSisallot: types.optional(types.string, ""),
  osaamisenOsoittaminen: types.array(OsaamisenOsoittaminen),
  olennainenSeikka: types.optional(types.boolean, false),
  osaamisenHankkimistavat: types.array(OsaamisenHankkimistapa),
  vaatimuksistaTaiTavoitteistaPoikkeaminen: types.optional(types.string, ""),
  nimi: types.optional(types.string, ""),
  laajuus: types.optional(types.number, 0),
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  koulutuksenJarjestaja: types.maybe(Organisaatio),
  amosaaTunniste: types.optional(types.string, ""),
  opetusJaOhjausMaara: types.maybe(types.number)
})

export const HankittavaPaikallinenTutkinnonOsa = types
  .compose(
    "HankittavaPaikallinenTutkinnonOsaModel",
    EnrichOrganisaatioOid({
      enrichedProperty: "koulutuksenJarjestaja",
      organzationOidProperty: "koulutuksenJarjestajaOid"
    }),
    Model,
    HankittavatTutkinnonOsatViews
  )
  .views(self => ({
    get otsikko() {
      return self.nimi
    },
    get osaamispisteet() {
      return self.laajuus
    },
    get tutkinnonOsaTyyppi(): TutkinnonOsaType {
      return TutkinnonOsaType.HankittavaPaikallinen
    },
    get tutkinnonOsaModuleId() {
      return self.moduleId
    }
  }))
