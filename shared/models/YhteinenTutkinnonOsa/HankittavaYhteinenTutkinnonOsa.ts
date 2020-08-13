import { types } from "mobx-state-tree"
import { YhteisenTutkinnonOsanOsaAlue } from "./YhteisenTutkinnonOsanOsaAlue"
import { EPerusteetVastaus } from "models/EPerusteetVastaus"
import { TutkinnonOsaType } from "../helpers/ShareTypes"
import { EnrichTutkinnonOsaAndOsaAlue } from "../Enrichment/EnrichTutkinnonOsaAndOsaAlue"

export const Model = types.model({
  moduleId: types.maybe(types.string),
  tutkinnonOsaKoodiUri: types.optional(types.string, ""),
  tutkinnonOsa: types.optional(EPerusteetVastaus, {}),
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  osaAlueet: types.array(YhteisenTutkinnonOsanOsaAlue)
})

export const HankittavaYhteinenTutkinnonOsa = types
  .compose(
    "HankittavaYhteinenTutkinnonOsa",
    EnrichTutkinnonOsaAndOsaAlue,
    Model
  )
  .views(self => ({
    get tutkinnonOsaTyyppi(): TutkinnonOsaType {
      return TutkinnonOsaType.HankittavaYhteinen
    },
    get tutkinnonOsaId() {
      return self.moduleId
    }
  }))
