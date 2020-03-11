import { types } from "mobx-state-tree"
import { getOtsikko } from "./getOtsikko"

export const AiemminHankitutTutkinnonOsatViews = types
  .model({})
  .views((self: any) => {
    return {
      get todentamisenProsessi() {
        return {
          koodiUri: self.valittuTodentamisenProsessiKoodiUri,
          lahetettyArvioitavaksi:
            self.tarkentavatTiedotOsaamisenArvioija.lahetettyArvioitavaksi
        }
      },
      opintoOtsikko(ospLyhenne: string): string {
        return getOtsikko(self, ospLyhenne)
      }
    }
  })
