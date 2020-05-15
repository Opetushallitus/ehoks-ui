import { types } from "mobx-state-tree"
import { YhteisenTutkinnonOsanOsaAlue } from "./YhteisenTutkinnonOsanOsaAlue"
import { EnrichKoodiUri } from "models/EnrichKoodiUri"
import { EPerusteetVastaus } from "models/EPerusteetVastaus"

export const Model = types.model({
  moduleId: types.maybe(types.string),
  tutkinnonOsaKoodiUri: types.optional(types.string, ""),
  tutkinnonOsa: types.optional(EPerusteetVastaus, {}),
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  osaAlueet: types.array(YhteisenTutkinnonOsanOsaAlue)
})

export const HankittavaYhteinenTutkinnonOsa = types
  .compose("HankittavaYhteinenTutkinnonOsa", EnrichKoodiUri, Model)
  .views(self => ({
    get tutkinnonOsaTyyppi() {
      return `HankittavaYhteinenTutkinnonOsa`
    },
    get tutkinnonOsaId() {
      return self.moduleId
    }
  }))
