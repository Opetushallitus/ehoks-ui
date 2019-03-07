import { types } from "mobx-state-tree"

export const Nayttoymparisto = types.model("Nayttoymparisto", {
  nimi: types.optional(types.string, ""),
  yTunnus: types.optional(types.string, ""),
  kuvaus: types.optional(types.string, "")
})
