import { types } from "mobx-state-tree"
import { TyoelamaOrganisaatio } from "./TyoelamaOrganisaatio"

export const TyoelamaArvioija = types.model("TyoelamaArvioija", {
  id: types.optional(types.number, 0),
  nimi: types.optional(types.string, ""),
  organisaatio: types.optional(TyoelamaOrganisaatio, {})
})
