import { types } from "mobx-state-tree"
import { KoodistoVastaus } from "./KoodistoVastaus"
import { EnrichKoodistoKoodiUri } from "./Enrichment/EnrichKoodistoKoodiUri"

const Model = types.model("OppimisenTukiModel", {
  oppimisenTuenTyyppiKoodiUri: types.optional(types.string, ""),
  oppimisenTuenTyyppi: types.optional(KoodistoVastaus, {}),
  alku: types.optional(types.string, ""),
  loppu: types.optional(types.string, ""),
  tutkinnonOsanTyyppiKoodiUri: types.optional(types.string, ""),
  tutkinnonOsanTyyppi: types.optional(KoodistoVastaus, {})
})

export const OppimisenTuki = types.compose(
  "OppimisenTuki",
  Model,
  EnrichKoodistoKoodiUri({
    enrichedProperty: "oppimisenTuenTyyppi",
    koodiUriProperty: "oppimisenTuenTyyppiKoodiUri"
  }),
  EnrichKoodistoKoodiUri({
    enrichedProperty: "tutkinnonOsanTyyppi",
    koodiUriProperty: "tutkinnonOsanTyyppiKoodiUri"
  })
)
