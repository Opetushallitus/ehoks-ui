import { types } from "mobx-state-tree"

export const TyoelamaOrganisaatio = types.model("TyoelamaOrganisaatio", {
  nimi: types.optional(types.string, ""),
  yTunnus: types.optional(types.string, "")
})
