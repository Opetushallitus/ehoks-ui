import { types, getRoot } from "mobx-state-tree"
import { OsaamisenOsoittaminen } from "./OsaamisenOsoittaminen"
import { OsaamisenHankkimistapa } from "./OsaamisenHankkimistapa"
import { HankittavatTutkinnonOsatViews } from "./helpers/HankittavatTutkinnonOsatViews"
import { EPerusteetVastaus } from "models/EPerusteetVastaus"
import { LocaleRoot } from "models/helpers/LocaleRoot"
import { TutkinnonOsaViite } from "models/TutkinnonOsaViite"
import { EnrichTutkinnonOsaViitteet } from "models/Enrichment/EnrichTutkinnonOsaViitteet"
import { Organisaatio } from "./Organisaatio"
import { TutkinnonOsaType } from "./helpers/ShareTypes"
import { EnrichTutkinnonOsaKoodiUri } from "./Enrichment/EnrichTutkinnonOsaKoodiUri"
import { EnrichOrganisaatioOid } from "./Enrichment/EnrichOrganisaatioOid"

export const Model = types.model({
  id: types.optional(types.number, 0),
  moduleId: types.maybe(types.string),
  tutkinnonOsaKoodiUri: types.optional(types.string, ""),
  tutkinnonOsa: types.optional(EPerusteetVastaus, {}),
  tutkinnonOsaViitteet: types.array(TutkinnonOsaViite),
  vaatimuksistaTaiTavoitteistaPoikkeaminen: types.optional(types.string, ""),
  osaamisenOsoittaminen: types.array(OsaamisenOsoittaminen),
  osaamisenHankkimistavat: types.array(OsaamisenHankkimistapa),
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  koulutuksenJarjestaja: types.maybe(Organisaatio),
  olennainenSeikka: types.optional(types.boolean, false),
  opetusJaOhjausMaara: types.maybe(types.number)
})

export const HankittavaAmmatillinenTutkinnonOsa = types
  .compose(
    "HankittavaAmmatillinenTutkinnonOsa",
    EnrichTutkinnonOsaKoodiUri,
    EnrichTutkinnonOsaViitteet("tutkinnonOsaViitteet"),
    EnrichOrganisaatioOid({
      enrichedProperty: "koulutuksenJarjestaja",
      organzationOidProperty: "koulutuksenJarjestajaOid"
    }),
    Model,
    HankittavatTutkinnonOsatViews
  )
  .views((self) => {
    const root: LocaleRoot = getRoot(self)
    return {
      get otsikko(): JSX.Element | string {
        return (
          self.tutkinnonOsa.nimi[root.translations.activeLocale] ||
          self.tutkinnonOsa.koodi.nimi[root.translations.activeLocale] ||
          self.tutkinnonOsa.nimi.fi ||
          self.tutkinnonOsa.koodi.nimi.fi
        )
      },
      get tutkinnonOsaTyyppi(): TutkinnonOsaType {
        return TutkinnonOsaType.HankittavaAmmatillinen
      },
      get tutkinnonOsaModuleId() {
        return self.moduleId
      }
    }
  })
