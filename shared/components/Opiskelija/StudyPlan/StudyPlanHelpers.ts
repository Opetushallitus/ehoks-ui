import { ShareType, TutkinnonOsaType } from "../../../models/helpers/ShareTypes"

export interface OpiskelusuunnitelmaState {
  activeAccordions: {
    suunnitelma: boolean
    suunnitelmat: {
      aikataulutetut: boolean
      suunnitellut: boolean
      valmiit: boolean
    }
    tavoitteet: boolean
    tukevatOpinnot: boolean
  }
  share: {
    type?: ShareType
    moduleId?: string
    tutkinnonOsaTyyppi?: TutkinnonOsaType
    tutkinnonOsaModuleId?: string
    hoksEid?: string
  }
}

export type StudyPartType = "aikataulutetut" | "suunnitellut" | "valmiit"

export type ActiveAccordions =
  keyof OpiskelusuunnitelmaState["activeAccordions"]
export type StudyPartSubAccordions =
  keyof OpiskelusuunnitelmaState["activeAccordions"]["suunnitelmat"]
