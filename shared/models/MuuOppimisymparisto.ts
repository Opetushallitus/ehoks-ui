import { types } from "mobx-state-tree"

export const MuuOppimisymparisto = types.model("MuuOppimisymparisto", {
  oppimisymparistoKoodiUri: types.optional(types.string, ""),
  selite: types.optional(types.string, ""),
  lisatiedot: types.optional(types.boolean, false)
})
