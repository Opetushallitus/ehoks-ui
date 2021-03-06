import { types } from "mobx-state-tree"
import { NaytonJarjestaja } from "./NaytonJarjestaja"
import { Nayttoymparisto } from "./Nayttoymparisto"
import { KoulutuksenJarjestajaArvioija } from "./KoulutuksenJarjestajaArvioija"
import { TyoelamaOsaamisenArvioija } from "./TyoelamaOsaamisenArvioija"
import { OsaAlueReference } from "./OsaAlueReference"

export const OsaamisenOsoittaminen = types
  .model("OsaamisenOsoittaminen", {
    id: types.optional(types.number, 0),
    moduleId: types.maybe(types.string),
    jarjestaja: types.optional(NaytonJarjestaja, {}),
    osaAlueet: types.optional(types.array(OsaAlueReference), []),
    nayttoymparisto: types.optional(Nayttoymparisto, {}),
    alku: types.optional(types.string, ""),
    loppu: types.optional(types.string, ""),
    koulutuksenJarjestajaOsaamisenArvioijat: types.optional(
      types.array(KoulutuksenJarjestajaArvioija),
      []
    ),
    tyoelamaOsaamisenArvioijat: types.optional(
      types.array(TyoelamaOsaamisenArvioija),
      []
    ),
    sisallonKuvaus: types.optional(types.array(types.string), []),
    vaatimuksistaTaiTavoitteistaPoikkeaminen: types.optional(types.string, ""),
    yksilollisetKriteerit: types.optional(types.array(types.string), [])
  })
  .views(self => ({
    get koulutuksenJarjestajaArvioijat() {
      return self.koulutuksenJarjestajaOsaamisenArvioijat.map(a =>
        [a.nimi, a.organisaatio.oppilaitosNimi].filter(Boolean).join(", ")
      )
    },
    get tyoelamaArvioijat() {
      return self.tyoelamaOsaamisenArvioijat.map(a =>
        [a.nimi, a.organisaatio.nimi, a.organisaatio.yTunnus]
          .filter(Boolean)
          .join(", ")
      )
    },
    get nayttoymparistoDetails() {
      return [self.nayttoymparisto.nimi, self.nayttoymparisto.yTunnus]
        .filter(Boolean)
        .join(", ")
    }
  }))
