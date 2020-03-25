import { types } from "mobx-state-tree"
import { YhteisenTutkinnonOsanOsaAlue } from "./YhteisenTutkinnonOsanOsaAlue"
import { EnrichKoodiUri } from "models/EnrichKoodiUri"
import { EPerusteetVastaus } from "models/EPerusteetVastaus"
import { EnrichOrganisaatioOid } from "./EnrichOrganisaatioOid"
import { Organisaatio } from "./Organisaatio"

export const Model = types.model({
  tutkinnonOsaKoodiUri: types.optional(types.string, ""),
  tutkinnonOsa: types.optional(EPerusteetVastaus, {}),
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  koulutuksenJarjestaja: types.maybe(Organisaatio),
  osaAlueet: types.array(YhteisenTutkinnonOsanOsaAlue)
})

export const HankittavaYhteinenTutkinnonOsa = types.compose(
  "HankittavaYhteinenTutkinnonOsa",
  EnrichKoodiUri,
  EnrichOrganisaatioOid("koulutuksenJarjestajaOid"),
  Model
)
