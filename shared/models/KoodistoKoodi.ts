import { types } from "mobx-state-tree"

export const KoodistoKoodi = types.model("KoodistoKoodi", {
  koodiVersio: types.optional(types.number, 0),
  koodiUri: types.optional(types.string, "")
})
