import { types } from "mobx-state-tree"
import { NaytonJarjestaja } from "./NaytonJarjestaja"
import { Nayttoymparisto } from "./Nayttoymparisto"
import { KoulutuksenjarjestajaArvioija } from "./KoulutuksenjarjestajaArvioija"
import { TyoelamaArvioija } from "./TyoelamaArvioija"

export const HankitunYTOOsaamisenNaytto = types.model(
  "HankitunYTOOsaamisenNaytto",
  {
    id: types.optional(types.number, 0),
    jarjestaja: types.optional(NaytonJarjestaja, {}),
    ytoOsaAlueKoodiUri: types.array(types.string),
    nayttoymparisto: types.optional(Nayttoymparisto, {}),
    alku: types.optional(types.string, ""),
    loppu: types.optional(types.string, ""),
    koulutuksenjarjestajaArvioijat: types.array(KoulutuksenjarjestajaArvioija),
    tyoelamaArvioijat: types.array(TyoelamaArvioija),
    osaamistavoitteet: types.array(types.string)
  }
)
