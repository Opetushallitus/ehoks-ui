import { types } from "mobx-state-tree"
import { OsaamisenHankkimistapa } from "./OsaamisenHankkimistapa"
import { OsaamisenOsoittaminen } from "./OsaamisenOsoittaminen"
import { HankittavatTutkinnonOsatViews } from "./helpers/HankittavatTutkinnonOsatViews"
import { EnrichOrganisaatioOid } from "./Enrichment/EnrichOrganisaatioOid"
import { Organisaatio } from "./Organisaatio"
import { TutkinnonOsaType } from "./helpers/ShareTypes"

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
  amosaaTunniste: types.optional(types.string, "")
})

export const HankittavaPaikallinenTutkinnonOsa = types
  .compose(
    "HankittavaPaikallinenTutkinnonOsaModel",
    EnrichOrganisaatioOid("koulutuksenJarjestajaOid"),
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
    get tutkinnonOsaId() {
      return self.moduleId
    }
  }))
