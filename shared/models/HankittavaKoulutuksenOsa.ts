import { types } from "mobx-state-tree"
import { EPerusteetVastaus } from "models/EPerusteetVastaus"
import { TutkinnonOsaType } from "./helpers/ShareTypes"
import { EnrichTutkinnonOsaKoodiUri } from "./Enrichment/EnrichTutkinnonOsaKoodiUri"
import { HankittavatTutkinnonOsatViews } from "./helpers/HankittavatTutkinnonOsatViews"

export const Model = types.model({
  id: types.optional(types.number, 0),
  koulutuksenOsaKoodiUri: types.optional(types.string, ""),
  koulutuksennOsa: types.optional(EPerusteetVastaus, {}),
  alku: types.optional(types.string, ""),
  loppu: types.optional(types.string, ""),
  laajuus: types.optional(types.number, 0)
})

export const HankittavaKoulutuksenOsa = types
  .compose(
    "HankittavaKoulutuksenOsa",
    EnrichTutkinnonOsaKoodiUri,
    Model,
    HankittavatTutkinnonOsatViews
  )
  .views(self => ({
    get tyyppi(): TutkinnonOsaType {
      return TutkinnonOsaType.HankittavaKoulutuksenOsa
    },
    get otsikko() {
      return "TUVA Koulutuksen Osa " + self.laajuus + " vkoa"
    },
    get ajanjakso() {
      return self.alku + " - " + self.loppu
    }
  }))
