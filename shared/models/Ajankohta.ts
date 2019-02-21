import { types } from "mobx-state-tree"

export const Ajankohta = types.model("Ajankohta", {
  alku: types.optional(types.string, ""),
  loppu: types.optional(types.string, "")
})
