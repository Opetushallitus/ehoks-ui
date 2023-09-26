import { types, getRoot } from "mobx-state-tree"
import { EPerusteetVastaus } from "models/EPerusteetVastaus"
import { TutkinnonOsaType } from "./helpers/ShareTypes"
import { EnrichTutkinnonOsaKoodiUri } from "./Enrichment/EnrichTutkinnonOsaKoodiUri"
import { HankittavatTutkinnonOsatViews } from "./helpers/HankittavatTutkinnonOsatViews"
import { TutkinnonOsaViite } from "models/TutkinnonOsaViite"
import { LocaleRoot } from "models/helpers/LocaleRoot"

export const Model = types.model({
  id: types.optional(types.number, 0),
  koulutuksenOsaKoodiUri: types.optional(types.string, ""),
  tutkinnonOsa: types.optional(EPerusteetVastaus, {}),
  alku: types.optional(types.string, ""),
  loppu: types.optional(types.string, ""),
  laajuus: types.optional(types.number, 0),
  tutkinnonOsaViitteet: types.array(TutkinnonOsaViite),
  vaatimuksistaTaiTavoitteistaPoikkeaminen: types.optional(types.string, ""),
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  olennainenSeikka: types.optional(types.boolean, false),
  opetusJaOhjausMaara: types.maybe(types.number)
})

export const HankittavaKoulutuksenOsa = types
  .compose(
    "HankittavaKoulutuksenOsa",
    EnrichTutkinnonOsaKoodiUri,
    Model,
    HankittavatTutkinnonOsatViews
  )
  .views(self => {
    const root: LocaleRoot = getRoot(self)
    return {
      get tyyppi(): TutkinnonOsaType {
        return TutkinnonOsaType.HankittavaKoulutuksenOsa
      },
      get otsikko(): JSX.Element | string {
        return (
          self.tutkinnonOsa.nimi[root.translations.activeLocale] ||
          self.tutkinnonOsa.nimi.fi
        )
      },
      get isValmis() {
        return new Date() >= new Date(self.loppu)
      }
    }
  })
