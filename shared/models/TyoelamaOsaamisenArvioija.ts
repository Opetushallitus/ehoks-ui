import { types } from "mobx-state-tree"
import { TyoelamaOrganisaatio } from "./TyoelamaOrganisaatio"

export const TyoelamaOsaamisenArvioija = types.model(
  "TyoelamaOsaamisenArvioija",
  {
    id: types.optional(types.number, 0),
    nimi: types.optional(types.string, ""),
    organisaatio: types.optional(TyoelamaOrganisaatio, {})
  }
)
