import { types } from "mobx-state-tree"

export const Oppilaitoshenkilo = types.model("Oppilaitoshenkilo", {
  id: types.optional(types.number, 0),
  nimi: types.optional(types.string, ""),
  rooli: types.optional(types.string, ""),
  oppilaitosOid: types.optional(types.string, "")
})
