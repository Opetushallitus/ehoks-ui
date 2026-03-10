import { getRoot, types } from "mobx-state-tree"
import { OsaamisenOsoittaminen } from "./OsaamisenOsoittaminen"
import { TodennettuArviointiLisatiedot } from "./TodennettuArviointiLisatiedot"
import { EPerusteetVastaus } from "models/EPerusteetVastaus"
import { LocaleRoot } from "models/helpers/LocaleRoot"
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
        return (
          self.tutkinnonOsa.nimi[root.translations.activeLocale] ||
          self.tutkinnonOsa.koodi.nimi[root.translations.activeLocale] ||
          self.tutkinnonOsa.nimi.fi ||
          self.tutkinnonOsa.koodi.nimi.fi
        )
      },
      get osaamispisteet() {
        return self.tutkinnonOsa.laajuus || 0
      },
      get tutkinnonOsaTyyppi(): TutkinnonOsaType {
        return TutkinnonOsaType.AiemminHankittuAmmatillinen
      },
      get tutkinnonOsaModuleId() {
        return self.moduleId
      }
    }
  })
