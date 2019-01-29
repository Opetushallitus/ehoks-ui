import { types } from "mobx-state-tree"

export const Suunnitelma = types.model("Suunnitelma", {
  eid: types.optional(types.string, ""),
  tutkinnonNimi: types.optional(types.string, ""),
  oppilaitos: types.optional(types.string, ""),
  aloitusPvm: types.optional(types.string, ""),
  keskeytysPvm: types.optional(types.string, "")
})
