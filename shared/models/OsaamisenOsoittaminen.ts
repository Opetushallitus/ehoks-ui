import { types } from "mobx-state-tree"
import { NaytonJarjestaja } from "./NaytonJarjestaja"
import { Nayttoymparisto } from "./Nayttoymparisto"
import { KoulutuksenJarjestajaArvioija } from "./KoulutuksenJarjestajaArvioija"
import { TyoelamaOsaamisenArvioija } from "./TyoelamaOsaamisenArvioija"
import { KoodistoKoodi } from "./KoodistoKoodi"

export const OsaamisenOsoittaminen = types.model("OsaamisenOsoittaminen", {
  id: types.optional(types.number, 0),
  jarjestaja: types.optional(NaytonJarjestaja, {}),
  osaAlueet: types.array(KoodistoKoodi),
  nayttoymparisto: types.optional(Nayttoymparisto, {}),
  alku: types.optional(types.string, ""),
  loppu: types.optional(types.string, ""),
  koulutuksenJarjestajaOsaamisenArvioijat: types.array(
    KoulutuksenJarjestajaArvioija
  ),
  tyoelamaOsaamisenArvioijat: types.array(TyoelamaOsaamisenArvioija),
  sisallonKuvaus: types.array(types.string),
  vaatimuksistaTaiTavoitteistaPoikkeaminen: types.optional(types.string, ""),
  yksilollisetKriteerit: types.array(types.string)
})
