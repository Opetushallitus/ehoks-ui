import { types } from "mobx-state-tree"

export const KoodiMetadata = types.model("KoodistoKoodi", {
  nimi: types.optional(types.string, ""),
  lyhytNimi: types.optional(types.string, ""),
  kuvaus: types.optional(types.string, ""),
  kieli: types.optional(types.string, "")
})
