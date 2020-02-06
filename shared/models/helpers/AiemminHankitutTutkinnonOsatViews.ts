import { types } from "mobx-state-tree"
import { getNaytot } from "./getNaytot"
import { Naytto } from "./TutkinnonOsa"
import { getOtsikko } from "./getOtsikko"

export const AiemminHankitutTutkinnonOsatViews = types.model({}).views((self: any) => {
  return {
    get naytot(): Naytto[] {
      return getNaytot(self.tarkentavatTiedotNaytto)
    },
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