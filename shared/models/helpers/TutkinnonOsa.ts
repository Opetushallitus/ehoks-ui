import { ShareType } from "stores/NotificationStore"
import { Instance } from "mobx-state-tree"
import { OsaamisenHankkimistapa } from "../OsaamisenHankkimistapa"
import { OsaamisenOsoittaminen } from "../OsaamisenOsoittaminen"

interface Arviointikriteeri {
  kuvaus?: string
  kriteerit?: string[]
}

export interface TodentamisenProsessi {
  koodiUri?: string
  lahetettyArvioitavaksi?: string
}

export interface Osaamisvaatimus {
  kuvaus?: string
  kriteerit?: Arviointikriteeri[]
}

export interface IOsaamisenHankkimistapa
  extends Instance<typeof OsaamisenHankkimistapa> {}

export interface IOsaamisenOsoittaminen
  extends Instance<typeof OsaamisenOsoittaminen> {}

interface TutkinnonOsa {
  id?: number
  otsikko?: string
  osaamispisteet?: number
  olennainenSeikka?: boolean
  tutkinnonOsaKoodiUri?: string
  opintoOtsikko: (ospLyhenne: string) => string
  tavoitteetJaSisallot?: string
}

export interface AiemminHankittuTutkinnonOsa extends TutkinnonOsa {
  tarkentavatTiedotNaytto?: IOsaamisenOsoittaminen[]
  todentamisenProsessi?: TodentamisenProsessi
}

export interface HankittavaTutkinnonOsa extends TutkinnonOsa {
  osaamisvaatimukset?: Osaamisvaatimus[]
  osaamisenOsoittaminen?: IOsaamisenOsoittaminen[]
  osaamisenHankkimistavat?: IOsaamisenHankkimistapa[]
  tila?: string
  hasNayttoOrHarjoittelujakso(koodiUri: string, type: ShareType | ""): boolean
}
