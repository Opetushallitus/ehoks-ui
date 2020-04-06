import { types } from "mobx-state-tree"

export const OsaamistasonKriteeri = types.model("OsaamistasonKriteeri", {
  osaamistaso: types.string,
  kriteerit: types.array(types.string)
})

export const Arviointikriteeri = types.model("Arviointikriteeri", {
  kuvaus: types.optional(types.string, ""),
  osaamistasonKriteerit: types.array(OsaamistasonKriteeri)
})

export const Osaamisvaatimus = types.model("Osaamisvaatimus", {
  kuvaus: types.optional(types.string, ""),
  kriteerit: types.array(Arviointikriteeri)
})
