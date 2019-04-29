import { types } from "mobx-state-tree"
import { Organisaatio } from "./Organisaatio"

export const Henkilo = types.model("Henkilo", {
  id: types.optional(types.number, 0),
  organisaatio: types.optional(Organisaatio, {}),
  nimi: types.optional(types.string, ""),
  rooli: types.optional(types.string, "")
})
