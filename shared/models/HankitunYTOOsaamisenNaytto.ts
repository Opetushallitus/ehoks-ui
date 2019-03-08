import { types } from "mobx-state-tree"
import { NaytonJarjestaja } from "./NaytonJarjestaja"
import { Nayttoymparisto } from "./Nayttoymparisto"
import { KoulutuksenJarjestajaArvioija } from "./KoulutuksenJarjestajaArvioija"
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
    koulutuksenJarjestajaArvioijat: types.array(KoulutuksenJarjestajaArvioija),
    tyoelamaArvioijat: types.array(TyoelamaArvioija),
    osaamistavoitteet: types.array(types.string)
  }
)
