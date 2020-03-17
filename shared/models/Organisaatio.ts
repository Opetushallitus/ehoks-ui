import { types } from "mobx-state-tree"

export const Organisaatio = types.model("Organisaatio", {
  oid: types.optional(types.string, ""),
  nimi: types.optional(
    types.model({
      fi: types.optional(types.string, ""),
      sv: types.optional(types.string, "")
    }),
    {}
  )
})
