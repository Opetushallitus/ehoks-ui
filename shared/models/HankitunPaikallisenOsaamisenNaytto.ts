import { types } from "mobx-state-tree"
import { NaytonJarjestaja } from "./NaytonJarjestaja"
import { Nayttoymparisto } from "./Nayttoymparisto"
import { KoulutuksenJarjestajaArvioija } from "./KoulutuksenJarjestajaArvioija"
import { TyoelamaOsaamisenArvioija } from "./TyoelamaOsaamisenArvioija"
import { KoodistoKoodi } from "./KoodistoKoodi"

export const HankitunPaikallisenOsaamisenNaytto = types.model(
  "HankitunPaikallisenOsaamisenNaytto",
  {
    id: types.optional(types.number, 0),
    uuid: types.optional(types.string, ""),
    jarjestaja: types.optional(NaytonJarjestaja, {}),
    osaAlueet: types.array(KoodistoKoodi),
    nayttoymparisto: types.optional(Nayttoymparisto, {}),
    alku: types.optional(types.string, ""),
    loppu: types.optional(types.string, ""),
    koulutuksenJarjestajaArvioijat: types.array(KoulutuksenJarjestajaArvioija),
    tyoelamaArvioijat: types.array(TyoelamaOsaamisenArvioija),
    keskeisetTyotehtavatNaytto: types.array(types.string)
  }
)
