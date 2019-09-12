import { types, Instance } from "mobx-state-tree"

export const Ajankohta = types.model("Ajankohta", {
  alku: types.optional(types.string, ""),
  loppu: types.optional(types.string, "")
})

export interface IAjankohta extends Instance<typeof Ajankohta> {}
