import { types } from "mobx-state-tree"

export const VastuullinenOhjaaja = types.model("VastuullinenOhjaaja", {
  id: types.optional(types.number, 0),
  nimi: types.optional(types.string, ""),
  sahkoposti: types.optional(types.string, "")
})
