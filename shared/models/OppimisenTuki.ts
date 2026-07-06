import { types } from "mobx-state-tree"

export const OppimisenTuki = types.model("OppimisenTuki", {
  oppimisenTuenTyyppiKoodiUri: types.optional(types.string, ""),
  alku: types.optional(types.string, ""),
  loppu: types.optional(types.string, ""),
  tutkinnonOsanTyyppiKoodiUri: types.optional(types.string, "")
})
