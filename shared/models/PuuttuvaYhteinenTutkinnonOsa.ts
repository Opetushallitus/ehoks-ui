import { types } from "mobx-state-tree"
import { OppijaYhteisenTutkinnonOsanOsaAlue } from "./OppijaYhteisenTutkinnonOsanOsaAlue"
import { EnrichKoodiUri } from "models/EnrichKoodiUri"
import { EPerusteetVastaus } from "models/EPerusteetVastaus"

const Model = types.model({
  tutkinnonOsaKoodiUri: types.optional(types.string, ""),
  tutkinnonOsa: types.optional(EPerusteetVastaus, {}),
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  osaAlueet: types.array(OppijaYhteisenTutkinnonOsanOsaAlue)
})

export const PuuttuvaYhteinenTutkinnonOsa = types.compose(
  "PuuttuvaYhteinenTutkinnonOsa",
  EnrichKoodiUri,
  Model
)
