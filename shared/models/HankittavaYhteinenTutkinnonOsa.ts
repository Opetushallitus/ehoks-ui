import { types } from "mobx-state-tree"
import { YhteisenTutkinnonOsanOsaAlue } from "./YhteisenTutkinnonOsanOsaAlue"
import { EPerusteetVastaus } from "models/EPerusteetVastaus"
import { TutkinnonOsaType } from "./helpers/ShareTypes"
import { EnrichTutkinnonOsaKoodiUri } from "./Enrichment/EnrichTutkinnonOsaKoodiUri"

export const Model = types.model({
  moduleId: types.maybe(types.string),
  tutkinnonOsaKoodiUri: types.optional(types.string, ""),
  tutkinnonOsa: types.optional(EPerusteetVastaus, {}),
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  osaAlueet: types.array(YhteisenTutkinnonOsanOsaAlue)
})

export const HankittavaYhteinenTutkinnonOsa = types
  .compose("HankittavaYhteinenTutkinnonOsa", EnrichTutkinnonOsaKoodiUri, Model)
  .views(self => ({
    get tutkinnonOsaTyyppi(): TutkinnonOsaType {
      return TutkinnonOsaType.HankittavaYhteinen
    },
    get tutkinnonOsaId() {
      return self.moduleId
    }
  }))
