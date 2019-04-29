import { types } from "mobx-state-tree"

export const Organisaatio = types.model("Organisaatio", {
  nimi: types.optional(types.string, ""),
  yTunnus: types.optional(types.string, "")
})
