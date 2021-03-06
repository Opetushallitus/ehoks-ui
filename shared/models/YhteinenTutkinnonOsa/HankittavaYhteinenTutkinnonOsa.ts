import { types } from "mobx-state-tree"
import { YhteisenTutkinnonOsanOsaAlue } from "./YhteisenTutkinnonOsanOsaAlue"
import { TutkinnonOsaType } from "../helpers/ShareTypes"
import { EnrichTutkinnonOsaAndOsaAlueet } from "../Enrichment/EnrichTutkinnonOsaAndOsaAlueet"

export const Model = types.model({
  moduleId: types.maybe(types.string),
  tutkinnonOsaKoodiUri: types.optional(types.string, ""),
  tutkinnonOsaId: types.maybe(types.number),
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  osaAlueet: types.array(YhteisenTutkinnonOsanOsaAlue)
})

export const HankittavaYhteinenTutkinnonOsa = types
  .compose(
    "HankittavaYhteinenTutkinnonOsa",
    EnrichTutkinnonOsaAndOsaAlueet,
    Model
  )
  .views(self => ({
    get tutkinnonOsaTyyppi(): TutkinnonOsaType {
      return TutkinnonOsaType.HankittavaYhteinen
    },
    get tutkinnonOsaModuleId() {
      return self.moduleId
    }
  }))
