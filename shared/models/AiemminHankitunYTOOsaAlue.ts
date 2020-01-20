import { types } from "mobx-state-tree"
import { OsaamisenOsoittaminen } from "./OsaamisenOsoittaminen"
import { TodennettuArviointiLisatiedot } from "./TodennettuArviointiLisatiedot"

export const AiemminHankitunYTOOsaAlue = types.model(
  "AiemminHankitunYTOOsaAlue",
  {
    id: types.optional(types.number, 0),
    uuid: types.optional(types.string, ""),
    olennainenSeikka: types.optional(types.boolean, false),
    osaAlueKoodiUri: types.optional(types.string, ""),
    koulutuksenJarjestajaOid: types.optional(types.string, ""),
    vaatimuksistaTaiTavoitteistaPoikkeaminen: types.optional(types.string, ""),
    valittuTodentamisenProsessiKoodiUri: types.optional(types.string, ""),
    tarkentavatTiedotNaytto: types.array(OsaamisenOsoittaminen),
    tarkentavatTiedotArvioija: types.optional(TodennettuArviointiLisatiedot, {})
  }
)
