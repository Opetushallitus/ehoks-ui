import { types } from "mobx-state-tree"
import { Ajankohta } from "models/Ajankohta"

export const Harjoittelujakso = types.model("Harjoittelujakso", {
  ajankohta: types.optional(Ajankohta, {}),
  hyvaksytty: types.optional(types.string, ""),
  ohjaaja: types.optional(types.string, ""),
  tyotehtavat: types.array(types.string)
})
