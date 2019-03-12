import { types } from "mobx-state-tree"
import { EnrichKoodiUri } from "../../shared/models/EnrichKoodiUri"
import { KoodistoVastaus } from "../../shared/models/KoodistoVastaus"

const Model = types.model("MuuOppimisymparistoModel", {
  oppimisymparistoKoodiUri: types.optional(types.string, ""),
  oppimisymparisto: types.optional(KoodistoVastaus, {}),
  selite: types.optional(types.string, ""),
  lisatiedot: types.optional(types.boolean, false)
})

export const MuuOppimisymparisto = types.compose(
  "MuuOppimisymparisto",
  EnrichKoodiUri,
  Model
)
