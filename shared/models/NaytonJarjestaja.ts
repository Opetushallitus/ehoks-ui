import { types } from "mobx-state-tree"

export const NaytonJarjestaja = types.model("NaytonJarjestaja", {
  id: types.optional(types.number, 0),
  oppilaitosOid: types.optional(types.string, "")
})
