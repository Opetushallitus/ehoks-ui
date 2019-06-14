import { types } from "mobx-state-tree"
import { VastuullinenTyopaikkaOhjaaja } from "./VastuullinenTyopaikkaOhjaaja"

export const TyopaikallaJarjestettavaKoulutus = types.model(
  "TyopaikallaJarjestettavaKoulutus",
  {
    id: types.optional(types.number, 0),
    vastuullinenTyopaikkaOhjaaja: types.optional(
      VastuullinenTyopaikkaOhjaaja,
      {}
    ),
    tyopaikanNimi: types.optional(types.string, ""),
    tyopaikanYTunnus: types.optional(types.string, ""),
    keskeisetTyotehtavat: types.array(types.string)
  }
)
