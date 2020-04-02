import { types, Instance } from "mobx-state-tree"
import { OsaamisenHankkimistapa } from "../OsaamisenHankkimistapa"
import { OsaamisenOsoittaminen } from "../OsaamisenOsoittaminen"
import { AiemminHankittuAmmatillinenTutkinnonOsa } from "models/AiemminHankittuAmmatillinenTutkinnonOsa"
import { AiemminHankittuPaikallinenTutkinnonOsa } from "models/AiemminHankittuPaikallinenTutkinnonOsa"
import { AiemminHankitunYTOOsaAlue } from "models/AiemminHankitunYTOOsaAlue"
import { HankittavaAmmatillinenTutkinnonOsa } from "models/HankittavaAmmatillinenTutkinnonOsa"
import { HankittavaPaikallinenTutkinnonOsa } from "models/HankittavaPaikallinenTutkinnonOsa"
import { YhteisenTutkinnonOsanOsaAlue } from "models/YhteisenTutkinnonOsanOsaAlue"
import { ShareType } from "stores/NotificationStore"
import { Organisaatio } from "../Organisaatio"

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

export interface IOrganisaatio extends Instance<typeof Organisaatio> {}

export interface IOsaamisenHankkimistapa
  extends Instance<typeof OsaamisenHankkimistapa> {}

export interface IOsaamisenOsoittaminen
  extends Instance<typeof OsaamisenOsoittaminen> {}

const HankittavaTutkinnonOsa = types
  .compose(
    HankittavaAmmatillinenTutkinnonOsa,
    HankittavaPaikallinenTutkinnonOsa,
    YhteisenTutkinnonOsanOsaAlue // added with flattenDeep
  )
  .named("HankittavaTutkinnonOsa")
export interface IHankittavaTutkinnonOsa
  extends Partial<Instance<typeof HankittavaTutkinnonOsa>> {
  /** YhteisenTutkinnonOsanOsaAlue does not contain this but it is defined after flattenDeep */
  opintoOtsikko(ospLyhenne: string): string
  /** YhteisenTutkinnonOsanOsaAlue does not contain this but it is defined after flattenDeep */

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
