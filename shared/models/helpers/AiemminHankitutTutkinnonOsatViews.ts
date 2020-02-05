import { types } from "mobx-state-tree"
import { getNaytot } from "./getNaytot"
import { Naytto } from "./TutkinnonOsa"

export const AiemminHankitutTutkinnonOsatViews = types.model({}).views((self: any) => {
  return {
    get naytot(): Naytto[] {
      return getNaytot(self.tarkentavatTiedotNaytto)
    }
  }
})