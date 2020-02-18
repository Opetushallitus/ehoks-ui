import { types } from "mobx-state-tree"
import { HOKS } from "models/HOKS"

export const Oppija = types.model("Oppija", {
  nimi: types.optional(types.string, ""),
  hoks: types.optional(HOKS, {})
})
