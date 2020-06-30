import { types } from "mobx-state-tree"
import { OsaamisenOsoittaminen } from "./OsaamisenOsoittaminen"
import { TodennettuArviointiLisatiedot } from "./TodennettuArviointiLisatiedot"
import { AiemminHankitunYTOOsaAlue } from "./AiemminHankitunYTOOsaAlue"
import { EPerusteetVastaus } from "models/EPerusteetVastaus"
import { TutkinnonOsaViite } from "models/TutkinnonOsaViite"
import { TutkinnonOsaType } from "./helpers/ShareTypes"

export const AiemminHankittuYhteinenTutkinnonOsa = types
  .model("AiemminHankittuYhteinenTutkinnonOsa", {
    id: types.optional(types.number, 0),
    moduleId: types.maybe(types.string),
    tutkinnonOsaKoodiUri: types.optional(types.string, ""),
    tutkinnonOsa: types.optional(EPerusteetVastaus, {}),
    tutkinnonOsaViitteet: types.array(TutkinnonOsaViite),
    koulutuksenJarjestajaOid: types.optional(types.string, ""),
    osaAlueet: types.array(AiemminHankitunYTOOsaAlue),
    valittuTodentamisenProsessiKoodiUri: types.optional(types.string, ""),
    tarkentavatTiedotNaytto: types.array(OsaamisenOsoittaminen),
    tarkentavatTiedotOsaamisenArvioija: types.optional(
      TodennettuArviointiLisatiedot,
      {}
    )
  })
  .views(self => ({
    get tutkinnonOsaTyyppi(): TutkinnonOsaType {
      return TutkinnonOsaType.AiemminHankittuYhteinen
    },
    get tutkinnonOsaId() {
      return self.moduleId
    }
  }))
