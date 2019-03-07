import { types } from "mobx-state-tree"
import { KoulutuksenjarjestajaArvioija } from "./KoulutuksenjarjestajaArvioija"

export const TodennettuArviointiLisatiedot = types.model(
  "TodennettuArviointiLisatiedot",
  {
    lahetettyArvioitavaksi: types.optional(types.string, ""),
    aiemminHankitunOsaamisenArvioija: types.array(KoulutuksenjarjestajaArvioija)
  }
)
