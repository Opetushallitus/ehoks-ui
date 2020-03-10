import { types } from "mobx-state-tree"
import { Organisaatio } from "./Organisaatio"
import { EnrichOrganisaatioOid } from "./EnrichOrganisaatioOid"

const Model = types.model("NaytonJarjestaja", {
  id: types.optional(types.number, 0),
  oppilaitosOid: types.optional(types.string, ""),
  oppilaitos: types.optional(Organisaatio, {})
})

export const NaytonJarjestaja = types.compose(
  "NaytonJarjestaja",
  EnrichOrganisaatioOid,
  Model
)
