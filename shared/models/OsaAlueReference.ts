import { types } from "mobx-state-tree"
import { KoodistoVastaus } from "./KoodistoVastaus"
import { EnrichKoodistoKoodiUri } from "./Enrichment/EnrichKoodistoKoodiUri"

export const Model = types.model({
  koodiVersio: types.optional(types.number, 0),
  koodiUri: types.optional(types.string, ""),
  osaAlueData: types.optional(KoodistoVastaus, {})
})

export const OsaAlueReference = types.compose(
  "OsaAlueReference",
  Model,
  EnrichKoodistoKoodiUri({
    enrichedField: "osaAlueData",
    koodiUriField: "koodiUri"
  })
)
