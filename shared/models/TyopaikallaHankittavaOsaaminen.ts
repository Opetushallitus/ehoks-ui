import { types } from "mobx-state-tree"
import { Henkilo } from "./Henkilo"
import { VastuullinenOhjaaja } from "./VastuullinenOhjaaja"

export const TyopaikallaHankittavaOsaaminen = types.model(
  "TyopaikallaHankittavaOsaaminen",
  {
    id: types.optional(types.number, 0),
    vastuullinenOhjaaja: types.optional(VastuullinenOhjaaja, {}),
    tyopaikanNimi: types.optional(types.string, ""),
    tyopaikanYTunnus: types.optional(types.string, ""),
    muutOsallistujat: types.array(Henkilo),
    keskeisetTyotehtavat: types.array(types.string),
    lisatiedot: types.optional(types.boolean, false)
  }
)
