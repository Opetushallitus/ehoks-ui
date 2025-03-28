import { Instance, types } from "mobx-state-tree"
import { OsaamisenHankkimistapa } from "../OsaamisenHankkimistapa"
import { OsaamisenOsoittaminen } from "../OsaamisenOsoittaminen"
import { AiemminHankittuAmmatillinenTutkinnonOsa } from "models/AiemminHankittuAmmatillinenTutkinnonOsa"
import { AiemminHankittuPaikallinenTutkinnonOsa } from "models/AiemminHankittuPaikallinenTutkinnonOsa"
import { AiemminHankitunYTOOsaAlue } from "models/YhteinenTutkinnonOsa/AiemminHankitunYTOOsaAlue"
import { HankittavaAmmatillinenTutkinnonOsa } from "models/HankittavaAmmatillinenTutkinnonOsa"
import { HankittavaPaikallinenTutkinnonOsa } from "models/HankittavaPaikallinenTutkinnonOsa"
import { HankittavaKoulutuksenOsa } from "models/HankittavaKoulutuksenOsa"
import { YhteisenTutkinnonOsanOsaAlue } from "models/YhteinenTutkinnonOsa/YhteisenTutkinnonOsanOsaAlue"
import { Organisaatio } from "../Organisaatio"
import { TodennettuArviointiLisatiedot } from "../TodennettuArviointiLisatiedot"
import { ShareType } from "./ShareTypes"

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

export type ITarkentavatTiedotOsaamisenArvioija = Instance<
  typeof TodennettuArviointiLisatiedot
>

export type IOrganisaatio = Instance<typeof Organisaatio>

export type IOsaamisenHankkimistapa = Instance<typeof OsaamisenHankkimistapa>

export type IOsaamisenOsoittaminen = Instance<typeof OsaamisenOsoittaminen>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HankittavaTutkinnonOsa = types
  .compose(
    HankittavaAmmatillinenTutkinnonOsa,
    HankittavaPaikallinenTutkinnonOsa,
    HankittavaKoulutuksenOsa,
    YhteisenTutkinnonOsanOsaAlue // added with flattenDeep
  )
  .named("HankittavaTutkinnonOsa")
export interface IHankittavaTutkinnonOsa
  extends Partial<Instance<typeof HankittavaTutkinnonOsa>> {
  /** YhteisenTutkinnonOsanOsaAlue does not contain this but it is defined after flattenDeep */
  opintoOtsikko(ospLyhenne: string): JSX.Element | string
  /** YhteisenTutkinnonOsanOsaAlue does not contain this but it is defined after flattenDeep */

  hasNayttoOrHarjoittelujakso(type?: ShareType, moduleId?: string): boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  opintoOtsikko(ospLyhenne: string): JSX.Element | string
}
