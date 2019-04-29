import { types } from "mobx-state-tree"

export const KoodistoVastaus = types.model("KoodistoVastaus", {
  nimi: types.optional(types.string, "")
})
