import { getRoot, types } from "mobx-state-tree"
import { OsaamisenHankkimistapa } from "../OsaamisenHankkimistapa"
import { OsaamisenOsoittaminen } from "../OsaamisenOsoittaminen"
import { HankittavatTutkinnonOsatViews } from "../helpers/HankittavatTutkinnonOsatViews"
import { Organisaatio } from "../Organisaatio"
import { TutkinnonOsaType } from "../helpers/ShareTypes"
import { EnrichOrganisaatioOid } from "../Enrichment/EnrichOrganisaatioOid"
import { OsaAlueVastaus } from "./OsaAlueVastaus"
import { LocaleRoot } from "../helpers/LocaleRoot"
import { getOsaamisvaatimukset } from "../helpers/getOsaamisvaatimukset"

const Model = types.model("YhteisenTutkinnonOsanOsaAlue", {
  id: types.optional(types.number, 0),
  moduleId: types.maybe(types.string),
  osaAlueKoodiUri: types.optional(types.string, ""),
  osaAlueEnrichedData: types.optional(OsaAlueVastaus, {}),
  osaamisenHankkimistavat: types.array(OsaamisenHankkimistapa),
  vaatimuksistaTaiTavoitteistaPoikkeaminen: types.optional(types.string, ""),
  osaamisenOsoittaminen: types.array(OsaamisenOsoittaminen),
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  koulutuksenJarjestaja: types.maybe(Organisaatio),
  olennainenSeikka: types.optional(types.boolean, false),
  opetusJaOhjausMaara: types.optional(types.number, 0)
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
  .views(self => {
    const root: LocaleRoot = getRoot(self)
    return {
      get otsikko() {
        return self.osaAlueEnrichedData
          ? self.osaAlueEnrichedData.osaAlueNimi
          : ""
      },

      get osaamisvaatimukset() {
        if (!self.osaAlueEnrichedData) return []

        const osaamistavoite = self.osaAlueEnrichedData.osaamistavoitteet.find(
          x => x.pakollinen
        )
        if (!osaamistavoite) return []

        return getOsaamisvaatimukset(
          osaamistavoite.arviointi,
          root.translations.activeLocale
        )
      },

      get osaamispisteet() {
        return self.osaAlueEnrichedData.laajuus
      },

      get tutkinnonOsaTyyppi(): TutkinnonOsaType {
        return TutkinnonOsaType.HankittavanYhteisenTutkinnonOsanOsaAlue
      }
    }
  })
