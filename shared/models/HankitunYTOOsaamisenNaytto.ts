import { types } from "mobx-state-tree"
import { NaytonJarjestaja } from "./NaytonJarjestaja"
import { Nayttoymparisto } from "./Nayttoymparisto"
import { KoulutuksenJarjestajaArvioija } from "./KoulutuksenJarjestajaArvioija"
import { TyoelamaOsaamisenArvioija } from "./TyoelamaOsaamisenArvioija"
import { KoodistoKoodi } from "./KoodistoKoodi"

export const HankitunYTOOsaamisenNaytto = types.model(
  "HankitunYTOOsaamisenNaytto",
  {
    id: types.optional(types.number, 0),
    jarjestaja: types.optional(NaytonJarjestaja, {}),
    osaAlueet: types.array(KoodistoKoodi),
    nayttoymparisto: types.optional(Nayttoymparisto, {}),
    alku: types.optional(types.string, ""),
    loppu: types.optional(types.string, ""),
    koulutuksenJarjestajaArvioijat: types.array(KoulutuksenJarjestajaArvioija),
    tyoelamaArvioijat: types.array(TyoelamaOsaamisenArvioija),
    osaamistavoitteet: types.array(types.string),
    keskeisetTyotehtavatNaytto: types.array(types.string)
  }
)
