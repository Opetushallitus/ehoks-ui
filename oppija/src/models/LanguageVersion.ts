import { types } from "mobx-state-tree"

export const LanguageVersion = types.model("LanguageVersion", {
  fi: types.optional(types.string, ""),
  sv: types.optional(types.string, "")
})
