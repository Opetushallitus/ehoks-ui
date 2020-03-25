import { ShareType } from "stores/NotificationStore"
import { types, Instance } from "mobx-state-tree"
import { OsaamisenHankkimistapa } from "../OsaamisenHankkimistapa"
import { OsaamisenOsoittaminen } from "../OsaamisenOsoittaminen"
import { AiemminHankittuAmmatillinenTutkinnonOsa } from "models/AiemminHankittuAmmatillinenTutkinnonOsa"
import { AiemminHankittuPaikallinenTutkinnonOsa } from "models/AiemminHankittuPaikallinenTutkinnonOsa"
import { AiemminHankitunYTOOsaAlue } from "models/AiemminHankitunYTOOsaAlue"

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

// TODO do it like IAiemminHankittuTutkinnonOsa ??
export interface HankittavaTutkinnonOsa extends TutkinnonOsa {
  osaamisvaatimukset?: Osaamisvaatimus[]
  osaamisenOsoittaminen?: IOsaamisenOsoittaminen[]
  osaamisenHankkimistavat?: IOsaamisenHankkimistapa[]
  tila?: string
  hasNayttoOrHarjoittelujakso(koodiUri: string, type: ShareType | ""): boolean
}

const AiemminHankittuTutkinnonOsa = types
  .compose(
    AiemminHankittuAmmatillinenTutkinnonOsa,
    AiemminHankittuPaikallinenTutkinnonOsa,
    AiemminHankitunYTOOsaAlue // added with flattenDeep
  )
  .named("AiemminHankittuTutkinnonOsa")

export interface IAiemminHankittuTutkinnonOsa
  extends Partial<Instance<typeof AiemminHankittuTutkinnonOsa>> {
  /** AiemminHankitunYTOOsaAlue does not contain this but it is defined after flattenDeep */
  opintoOtsikko(ospLyhenne: string): string
}
