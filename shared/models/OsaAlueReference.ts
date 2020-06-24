import { types } from "mobx-state-tree"
import { EnrichKoodiUri } from "./Enrichment/EnrichKoodiUri"
import { KoodistoVastaus } from "./KoodistoVastaus"

export const Model = types.model({
  koodiVersio: types.optional(types.number, 0),
  koodiUri: types.optional(types.string, ""),
  osaAlueData: types.optional(KoodistoVastaus, {})
})

export const OsaAlueReference = types.compose(
  "OsaAlueReference",
  Model,
  EnrichKoodiUri
)
