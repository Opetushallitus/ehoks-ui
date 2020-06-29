import { types } from "mobx-state-tree"
import { EnrichKoodiUri } from "models/Enrichment/EnrichKoodiUri"
import { KoodistoVastaus } from "models/KoodistoVastaus"

const Model = types.model("MuuOppimisymparistoModel", {
  oppimisymparistoKoodiUri: types.optional(types.string, ""),
  oppimisymparisto: types.optional(KoodistoVastaus, {}),
  alku: types.optional(types.string, ""),
  loppu: types.optional(types.string, "")
})

export const MuuOppimisymparisto = types.compose(
  "MuuOppimisymparisto",
  EnrichKoodiUri,
  Model
)
