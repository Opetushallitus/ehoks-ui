import { types } from "mobx-state-tree"
import { KoulutuksenJarjestajaOrganisaatio } from "./KoulutuksenJarjestajaOrganisaatio"

export const KoulutuksenJarjestajaArvioija = types.model(
  "KoulutuksenJarjestajaArvioija",
  {
    id: types.optional(types.number, 0),
    nimi: types.optional(types.string, ""),
    organisaatio: types.optional(KoulutuksenJarjestajaOrganisaatio, {})
  }
)
