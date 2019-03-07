import { types } from "mobx-state-tree"
import { Oppilaitoshenkilo } from "./Oppilaitoshenkilo"
import { TyopaikallaHankittavaOsaaminen } from "./TyopaikallaHankittavaOsaaminen"
import { MuuOppimisymparisto } from "./MuuOppimisymparisto"
import { EnrichKoodiUri } from "models/EnrichKoodiUri"
import { KoodistoVastaus } from "../../shared/models/KoodistoVastaus"

const Model = types.model("OsaamisenHankkimistapaModel", {
  id: types.optional(types.number, 0),
  hankkijanEdustaja: types.optional(Oppilaitoshenkilo, {}),
  tyopaikallaHankittavaOsaaminen: types.optional(
    TyopaikallaHankittavaOsaaminen,
    {}
  ),
  osaamisenHankkimistapaKoodiUri: types.optional(types.string, ""),
  osaamisenHankkimistapa: types.optional(KoodistoVastaus, {}),
  jarjestajanEdustaja: types.optional(Oppilaitoshenkilo, {}),
  ajanjaksonTarkenne: types.optional(types.string, ""),
  alku: types.optional(types.string, ""),
  muutOppimisymparisto: types.array(MuuOppimisymparisto),
  loppu: types.optional(types.string, "")
})

export const OsaamisenHankkimistapa = types.compose(
  "OsaamisenHankkimistapa",
  EnrichKoodiUri,
  Model
)
