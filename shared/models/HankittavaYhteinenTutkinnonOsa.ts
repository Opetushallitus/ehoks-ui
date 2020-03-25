import { types } from "mobx-state-tree"
import { YhteisenTutkinnonOsanOsaAlue } from "./YhteisenTutkinnonOsanOsaAlue"
import { EnrichKoodiUri } from "models/EnrichKoodiUri"
import { EPerusteetVastaus } from "models/EPerusteetVastaus"
import { Oppilaitoshenkilo } from "./Oppilaitoshenkilo"
import { EnrichOrganisaatioOid } from "./EnrichOrganisaatioOid"

export const Model = types.model({
  tutkinnonOsaKoodiUri: types.optional(types.string, ""),
  tutkinnonOsa: types.optional(EPerusteetVastaus, {}),
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  koulutuksenJarjestaja: types.maybe(Oppilaitoshenkilo),
  osaAlueet: types.array(YhteisenTutkinnonOsanOsaAlue)
})

export const HankittavaYhteinenTutkinnonOsa = types.compose(
  "HankittavaYhteinenTutkinnonOsa",
  EnrichKoodiUri,
  EnrichOrganisaatioOid("koulutuksenJarjestajaOid"),
  Model
)
