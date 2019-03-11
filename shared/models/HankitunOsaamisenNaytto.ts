import { types } from "mobx-state-tree"
import { NaytonJarjestaja } from "./NaytonJarjestaja"
import { Nayttoymparisto } from "./Nayttoymparisto"
import { KoulutuksenJarjestajaArvioija } from "./KoulutuksenJarjestajaArvioija"
import { TyoelamaArvioija } from "./TyoelamaArvioija"

export const HankitunOsaamisenNaytto = types.model("HankitunOsaamisenNaytto", {
  id: types.optional(types.number, 0),
  jarjestaja: types.optional(NaytonJarjestaja, {}),
  osaAlueKoodiUri: types.array(types.string),
  nayttoymparisto: types.optional(Nayttoymparisto, {}),
  alku: types.optional(types.string, ""),
  loppu: types.optional(types.string, ""),
  koulutuksenJarjestajaArvioijat: types.array(KoulutuksenJarjestajaArvioija),
  tyoelamaArvioijat: types.array(TyoelamaArvioija),
  keskeisetTyotehtavatNaytto: types.array(types.string)
})
