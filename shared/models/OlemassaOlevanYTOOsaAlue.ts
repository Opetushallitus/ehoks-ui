import { types } from "mobx-state-tree"
import { HankitunOsaamisenNaytto } from "./HankitunOsaamisenNaytto"
import { TodennettuArviointiLisatiedot } from "./TodennettuArviointiLisatiedot"

export const OlemassaOlevanYTOOsaAlue = types.model(
  "OlemassaOlevanYTOOsaAlue",
  {
    id: types.optional(types.number, 0),
    osaAlueKoodiUri: types.optional(types.string, ""),
    koulutuksenJarjestajaOid: types.optional(types.string, ""),
    vaatimuksistaTaiTavoitteistaPoikkeaminen: types.optional(types.string, ""),
    valittuTodentamisenProsessiKoodiUri: types.optional(types.string, ""),
    tarkentavatTiedotNaytto: types.array(HankitunOsaamisenNaytto),
    tarkentavatTiedotArvioija: types.optional(TodennettuArviointiLisatiedot, {})
  }
)
