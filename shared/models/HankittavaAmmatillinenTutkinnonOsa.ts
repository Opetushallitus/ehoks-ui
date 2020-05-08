import { types, getRoot } from "mobx-state-tree"
import { OsaamisenOsoittaminen } from "./OsaamisenOsoittaminen"
import { OsaamisenHankkimistapa } from "./OsaamisenHankkimistapa"
import { HankittavatTutkinnonOsatViews } from "./helpers/HankittavatTutkinnonOsatViews"
import { EnrichKoodiUri } from "models/EnrichKoodiUri"
import { EPerusteetVastaus } from "models/EPerusteetVastaus"
import { LocaleRoot } from "models/helpers/LocaleRoot"
import { TutkinnonOsaViite } from "models/TutkinnonOsaViite"
import { EnrichTutkinnonOsa } from "models/EnrichTutkinnonOsa"
import { EnrichOrganisaatioOid } from "./EnrichOrganisaatioOid"
import { Organisaatio } from "./Organisaatio"

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
  olennainenSeikka: types.optional(types.boolean, false)
})

export const HankittavaAmmatillinenTutkinnonOsa = types
  .compose(
    "HankittavaAmmatillinenTutkinnonOsa",
    EnrichKoodiUri,
    EnrichTutkinnonOsa("tutkinnonOsaViitteet"),
    EnrichOrganisaatioOid("koulutuksenJarjestajaOid"),
    Model,
    HankittavatTutkinnonOsatViews
  )
  .views(self => {
    const root: LocaleRoot = getRoot(self)
    return {
      get otsikko() {
        return self.tutkinnonOsa && self.tutkinnonOsa.nimi
          ? self.tutkinnonOsa.nimi[root.translations.activeLocale]
          : ""
      },
      get tutkinnonOsaTyyppi() {
        return `AiemminHankittuAmmatillinenTutkinnonOsa`
      },
      get tutkinnonOsaId() {
        return self.moduleId
      }
    }
  })
