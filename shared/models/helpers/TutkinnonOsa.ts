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

export interface Oppimisymparisto {
  nimi?: string
}
export interface MuuOppimisymparisto {
  alku?: string
  loppu?: string
  oppimisymparisto?: Oppimisymparisto
}

export interface OsaamisenHankkimistapa {
  tyopaikallaJarjestettavaKoulutus?: { tyopaikanYTunnus: string }
  osaamisenHankkimistapaKoodiUri?: string
  ajanjaksonTarkenne?: string
  jarjestajanEdustaja?: { nimi?: string; oppilaitosOid?: string }
  muutOppimisymparistot?: MuuOppimisymparisto[]
  alku: string
  loppu: string
}

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
  organisaatio: { oppilaitosOid: string, oppilaitosNimi: string}
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
  tavoitteetJaSisallot?: string
}

export interface HankittavaTutkinnonOsa extends TutkinnonOsa {
  hasNayttoOrHarjoittelujakso(koodiUri: string, type: ShareType | ""): boolean
}
