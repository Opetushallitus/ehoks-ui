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

export interface Oppimisymparisto {
  nimi?: string
}
export interface MuuOppimisymparisto {
  alku?: string
  loppu?: string
  oppimisymparisto?: Oppimisymparisto
}

export interface IOsaamisenHankkimistapa
  extends Instance<typeof OsaamisenHankkimistapa> {}

export interface Organisaatio {
  nimi: string
  yTunnus: string
}

export interface IOsaamisenOsoittaminen
  extends Instance<typeof OsaamisenOsoittaminen> {}

export interface Naytto {
  alku?: string
  loppu?: string
  organisaatio?: string
  ymparisto?: string
  koulutuksenJarjestajaArvioijat?: string[]
  tyoelamaArvioijat?: string[]
  tyotehtavat?: string[]
  yksilollisetKriteerit?: string[]
  vaatimuksistaTaiTavoitteistaPoikkeaminen?: string
  tyyppi?: "DEMONSTRATION"
}

interface TutkinnonOsa {
  id?: number
  naytot?: Naytto[]
  otsikko?: string
  osaamispisteet?: number
  sijainnit?: string[]
  tila?: string
  todentamisenProsessi?: TodentamisenProsessi
  olennainenSeikka?: boolean
  tutkinnonOsaKoodiUri?: string
  opintoOtsikko: (ospLyhenne: string) => string
  tavoitteetJaSisallot?: string
}

export interface AiemminHankittuTutkinnonOsa extends TutkinnonOsa {
  tarkentavatTiedotNaytto?: IOsaamisenOsoittaminen[]
}

export interface HankittavaTutkinnonOsa extends TutkinnonOsa {
  osaamisvaatimukset?: Osaamisvaatimus[]
  osaamisenOsoittaminen?: IOsaamisenOsoittaminen[]
  osaamisenHankkimistavat?: IOsaamisenHankkimistapa[]
  hasNayttoOrHarjoittelujakso(koodiUri: string, type: ShareType | ""): boolean
}
