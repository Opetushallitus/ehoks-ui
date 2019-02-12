import { types } from "mobx-state-tree"

export const Arviointikriteeri = types.model("Arviointikriteeri", {
  kuvaus: types.optional(types.string, ""),
  kriteerit: types.array(types.string)
})

export const Osaamisvaatimus = types.model("Osaamisvaatimus", {
  kuvaus: types.optional(types.string, ""),
  kriteerit: types.array(Arviointikriteeri)
})
