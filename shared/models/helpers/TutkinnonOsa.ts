import { ShareType } from "stores/NotificationStore"

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

export interface OsaamisenHankkimistapa {
  tyopaikallaJarjestettavaKoulutus?: { tyopaikanYTunnus: string }
  ajanjaksonTarkenne?: string
  jarjestajanEdustaja?: { nimi?: string; oppilaitosOid?: string }
}

export interface Nayttoymparisto {
  kuvaus?: string
  nimi?: string
  yTunnus?: string
}
export interface OsaamisenOsoittaminen {
  alku?: string
  loppu?: string
  jarjestaja?: { oppilaitosOid?: string }
  nayttoYmparisto?: Nayttoymparisto
}

export interface Naytto {
  alku?: string
  loppu?: string
  organisaatio?: string
  ymparisto?: string
  koulutuksenJarjestajaArvioijat?: string[]
  tyoelamaArvioijat?: string[]
  tyotehtavat?: string[]
  tyyppi?: "DEMONSTRATION"
}

export interface Harjoittelujakso {
  alku?: string
  loppu?: string
  ohjaaja?: { nimi: string; sahkoposti: string }
  tyotehtavat?: string[]
  nimi?: string
  selite?: string
  tyyppi?: "WORKPLACE" | "OTHER"
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
  harjoittelujaksot?: Harjoittelujakso[]
  tila?: string
  todentamisenProsessi?: TodentamisenProsessi
  olennainenSeikka?: boolean
  tutkinnonOsaKoodiUri?: string
  opintoOtsikko: (ospLyhenne: string) => string
}

export interface HankittavaTutkinnonOsa extends TutkinnonOsa {
  hasNayttoOrHarjoittelujakso(koodiUri: string, type: ShareType | ""): boolean
}
