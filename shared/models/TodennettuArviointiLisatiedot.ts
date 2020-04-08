import { types } from "mobx-state-tree"
import { KoulutuksenJarjestajaArvioija } from "./KoulutuksenJarjestajaArvioija"

export const TodennettuArviointiLisatiedot = types.model(
  "TodennettuArviointiLisatiedot",
  {
    lahetettyArvioitavaksi: types.optional(types.string, ""),
    aiemminHankitunOsaamisenArvioijat: types.array(
      KoulutuksenJarjestajaArvioija
    )
  }
)
