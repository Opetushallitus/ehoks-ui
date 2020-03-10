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

export interface OsaamisenHankkimistapa
  extends Instance<typeof OsaamisenHankkimistapa> {}

export interface Organisaatio {
  nimi: string
  yTunnus: string
}

export interface OsaamisenOsoittaminen
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

export interface TutkinnonOsa {
  id?: number
  osaamisvaatimukset?: Osaamisvaatimus[]
  osaamisenHankkimistavat?: OsaamisenHankkimistapa[]
  osaamisenOsoittaminen?: OsaamisenOsoittaminen[]
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

export interface HankittavaTutkinnonOsa extends TutkinnonOsa {
  hasNayttoOrHarjoittelujakso(koodiUri: string, type: ShareType | ""): boolean
}
