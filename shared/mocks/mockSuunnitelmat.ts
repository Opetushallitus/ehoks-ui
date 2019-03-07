import { aiemmatOpinnot } from "mocks/mockAiemmatOpinnot"
import { SnapshotOrInstance } from "mobx-state-tree"
import { HOKS } from "models/HOKS"
import { opinnot } from "mocks/mockOpinnot"

export const suunnitelmat: Array<SnapshotOrInstance<typeof HOKS>> = [
  {
    eid: "1",
    tutkinnonNimi: "Sosiaali- ja terveysalan perustutkinto",
    osaamispisteet: 180,
    osaamisala: "Sairaanhoidon ja huolenpidon osaamisala",
    tutkintonimike: "Lähihoitaja",
    oppilaitos: "Opinpaikka",
    aloitusPvm: "2018-08-15",
    aiemmatOpinnot: [{ ...aiemmatOpinnot[0] }],
    opinnot: [...opinnot]
  },
  {
    eid: "2",
    tutkinnonNimi: "Asiakaskokemuksen kehittäminen ja palvelumuotoilu",
    osaamispisteet: 180,
    osaamisala: "Palvelumuotoilun osaamisala",
    tutkintonimike: "Palvelumuotoilija",
    oppilaitos: "Keuda",
    aloitusPvm: "2018-08-01",
    opinnot: [...opinnot]
  },
  {
    eid: "3",
    tutkinnonNimi: "Media-alan ammattitutkinto",
    osaamispisteet: 150,
    osaamisala: "Valokuvauksen osaamisala",
    tutkintonimike: "Valokuvaaja",
    oppilaitos: "Keuda",
    keskeytysPvm: "2017-01-12",
    opinnot: [...opinnot]
  }
]
