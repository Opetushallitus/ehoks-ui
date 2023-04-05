import { getRoot, types } from "mobx-state-tree"
import { OsaamisenOsoittaminen } from "./OsaamisenOsoittaminen"
import { TodennettuArviointiLisatiedot } from "./TodennettuArviointiLisatiedot"
import { EPerusteetVastaus } from "models/EPerusteetVastaus"
import { LocaleRoot } from "models/helpers/LocaleRoot"
import { getOsaamispisteet } from "models/helpers/getOsaamispisteet"
import { EnrichTutkinnonOsaViitteet } from "models/Enrichment/EnrichTutkinnonOsaViitteet"
import { TutkinnonOsaViite } from "models/TutkinnonOsaViite"
import { AiemminHankitutTutkinnonOsatViews } from "./helpers/AiemminHankitutTutkinnonOsatViews"
import { Organisaatio } from "./Organisaatio"
import { TutkinnonOsaType } from "./helpers/ShareTypes"
import { EnrichTutkinnonOsaKoodiUri } from "./Enrichment/EnrichTutkinnonOsaKoodiUri"
import { EnrichOrganisaatioOid } from "./Enrichment/EnrichOrganisaatioOid"

const Model = types.model({
  id: types.optional(types.number, 0),
  moduleId: types.maybe(types.string),
  tutkinnonOsaKoodiUri: types.optional(types.string, ""),
  tutkinnonOsa: types.optional(EPerusteetVastaus, {}),
  tutkinnonOsaViitteet: types.array(TutkinnonOsaViite),
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  koulutuksenJarjestaja: types.maybe(Organisaatio),
  valittuTodentamisenProsessiKoodiUri: types.optional(types.string, ""),
  tarkentavatTiedotNaytto: types.array(OsaamisenOsoittaminen),
  tarkentavatTiedotOsaamisenArvioija: types.optional(
    TodennettuArviointiLisatiedot,
    {}
  ),
  olennainenSeikka: types.optional(types.boolean, false)
})

export const AiemminHankittuAmmatillinenTutkinnonOsa = types
  .compose(
    "AiemminHankittuAmmatillinenTutkinnonOsa",
    EnrichTutkinnonOsaKoodiUri,
    EnrichTutkinnonOsaViitteet("tutkinnonOsaViitteet"),
    EnrichOrganisaatioOid({
      enrichedProperty: "koulutuksenJarjestaja",
      organzationOidProperty: "koulutuksenJarjestajaOid"
    }),
    AiemminHankitutTutkinnonOsatViews,
    Model
  )
  .views(self => {
    const root: LocaleRoot = getRoot(self)
    return {
      get otsikko(): JSX.Element | string {
        return self.tutkinnonOsa && self.tutkinnonOsa.nimi
          ? self.tutkinnonOsa.nimi[root.translations.activeLocale]
          : ""
      },
      get osaamispisteet() {
        return getOsaamispisteet(self.tutkinnonOsaViitteet)
      },
      get tutkinnonOsaTyyppi(): TutkinnonOsaType {
        return TutkinnonOsaType.AiemminHankittuAmmatillinen
      },
      get tutkinnonOsaModuleId() {
        return self.moduleId
      }
    }
  })
