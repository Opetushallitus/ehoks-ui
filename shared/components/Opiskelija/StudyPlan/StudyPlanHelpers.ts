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
    koodiUri: string
    type: string
    uuid: string
  }
}

export type StudyPartType = "aikataulutetut" | "suunnitellut" | "valmiit"

export type ActiveAccordions = keyof OpiskelusuunnitelmaState["activeAccordions"]
export type StudyPartSubAccordions = keyof OpiskelusuunnitelmaState["activeAccordions"]["suunnitelmat"]
export type share = keyof OpiskelusuunnitelmaState["share"]