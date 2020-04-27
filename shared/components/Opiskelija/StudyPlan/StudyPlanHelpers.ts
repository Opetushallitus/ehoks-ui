import { ShareType } from "stores/NotificationStore"

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
    type: ShareType
    moduleId: string
  }
}

export type StudyPartType = "aikataulutetut" | "suunnitellut" | "valmiit"

export type ActiveAccordions = keyof OpiskelusuunnitelmaState["activeAccordions"]
export type StudyPartSubAccordions = keyof OpiskelusuunnitelmaState["activeAccordions"]["suunnitelmat"]
