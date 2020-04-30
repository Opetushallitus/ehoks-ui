import { types } from "mobx-state-tree"
import { OsaamisenOsoittaminen } from "./OsaamisenOsoittaminen"
import { TodennettuArviointiLisatiedot } from "./TodennettuArviointiLisatiedot"
import { AiemminHankitunYTOOsaAlue } from "./AiemminHankitunYTOOsaAlue"
import { EPerusteetVastaus } from "models/EPerusteetVastaus"
import { TutkinnonOsaViite } from "models/TutkinnonOsaViite"
import { KoodistoVastaus } from "models/KoodistoVastaus"

export const AiemminHankittuYhteinenTutkinnonOsa = types.model(
  "AiemminHankittuYhteinenTutkinnonOsa",
  {
    id: types.optional(types.number, 0),
    moduleId: types.maybe(types.string),
    tutkinnonOsaKoodiUri: types.optional(types.string, ""),
    tutkinnonOsa: types.optional(EPerusteetVastaus, {}),
    tutkinnonOsaViitteet: types.array(TutkinnonOsaViite),
    koulutuksenJarjestajaOid: types.optional(types.string, ""),
    osaAlueet: types.array(AiemminHankitunYTOOsaAlue),
    valittuTodentamisenProsessiKoodiUri: types.optional(types.string, ""),
    valittuTodentamisenProsessi: types.optional(KoodistoVastaus, {}),
    tarkentavatTiedotNaytto: types.array(OsaamisenOsoittaminen),
    tarkentavatTiedotOsaamisenArvioija: types.optional(
      TodennettuArviointiLisatiedot,
      {}
    )
  }
)
