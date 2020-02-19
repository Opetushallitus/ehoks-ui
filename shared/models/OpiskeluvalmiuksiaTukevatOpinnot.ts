import { types } from "mobx-state-tree"

export const OpiskeluvalmiuksiaTukevatOpinnot = types.model(
  "OpiskeluvalmiuksiaTukevatOpinnotModel",
  {
    nimi: types.optional(types.string, ""),
    kuvaus: types.optional(types.string, ""),
    alku: types.optional(types.string, ""),
    loppu: types.optional(types.string, "")
  }
)
