import { types } from "mobx-state-tree"
import { KoodistoVastaus } from "models/KoodistoVastaus"
import { EnrichKoodistoKoodiUri } from "./Enrichment/EnrichKoodistoKoodiUri"

const Model = types.model("MuuOppimisymparistoModel", {
  oppimisymparistoKoodiUri: types.optional(types.string, ""),
  oppimisymparisto: types.optional(KoodistoVastaus, {}),
  alku: types.optional(types.string, ""),
  loppu: types.optional(types.string, "")
})

export const MuuOppimisymparisto = types.compose(
  "MuuOppimisymparisto",
  EnrichKoodistoKoodiUri({
    enrichedField: "oppimisymparisto",
    koodiUriField: "oppimisymparistoKoodiUri"
  }),
  Model
)
