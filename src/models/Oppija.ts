import { types } from "mobx-state-tree"

export const Oppija = types.model("Oppija", {
  name: types.optional(types.string, "")
})
