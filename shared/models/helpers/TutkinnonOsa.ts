interface Ajankohta {
  alku?: string
  loppu?: string
}

interface Arviointikriteeri {
  kuvaus?: string
  kriteerit?: string[]
}

interface Osaamisvaatimus {
  kuvaus?: string
  kriteerit?: Arviointikriteeri[]
}

export interface Naytto {
  ajankohta?: Ajankohta
  organisaatio?: string
  ymparisto?: string
  arvioijat?: string[]
  tyotehtavat?: string[]
}

interface Harjoittelujakso {
  ajankohta?: Ajankohta
  hyvaksytty?: string
  ohjaaja?: string
  tyotehtavat?: string[]
}

export interface TutkinnonOsa {
  id?: number
  osaamisvaatimukset?: Osaamisvaatimus[]
  naytot?: Naytto[]
  otsikko?: string
  osaamispisteet?: number
  sijainnit?: string[]
  harjoittelujaksot?: Harjoittelujakso[]
  tila?: string
  opintoOtsikko: (ospLyhenne: string) => string
}
