import { ShareType } from "stores/NotificationStore"
import { Instance } from "mobx-state-tree"
import { OsaamisenHankkimistapa } from "../OsaamisenHankkimistapa"

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

export interface JarjestajanEdustaja
  extends Instance<typeof Oppilaitoshenkilo> {}

export interface OsaamisenHankkimistapa
  extends Instance<typeof OsaamisenHankkimistapa> {}

export interface Nayttoymparisto {
  nimi: string
  yTunnus?: string
  kuvaus?: string
}

export interface Organisaatio {
  nimi: string
  yTunnus: string
}

export interface TyoelamaOsaamisenArvioija {
  nimi: string
  organisaatio: Organisaatio
}

export interface KoulutuksenJarjestajaOsaamisenArvioija {
  nimi: string
  organisaatio: { oppilaitosOid: string; oppilaitosNimi: string }
}

export interface OsaamisenOsoittaminen {
  alku: string
  loppu: string
  jarjestaja?: { oppilaitosOid?: string }
  nayttoymparisto: Nayttoymparisto
  tyoelamaOsaamisenArvioijat: TyoelamaOsaamisenArvioija[]
  koulutuksenJarjestajaOsaamisenArvioijat: KoulutuksenJarjestajaOsaamisenArvioija[]
  sisallonKuvaus: string[]
  yksilollisetKriteerit: string[]
  vaatimuksistaTaiTavoitteistaPoikkeaminen: string
}

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
