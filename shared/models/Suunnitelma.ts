import { types } from "mobx-state-tree"
import { Opinto } from "./Opinto"

export const Suunnitelma = types
  .model("Suunnitelma", {
    eid: types.optional(types.string, ""),
    tutkinnonNimi: types.optional(types.string, ""),
    osaamispisteet: types.optional(types.number, 0),
    osaamisala: types.optional(types.string, ""),
    tutkintonimike: types.optional(types.string, ""),
    oppilaitos: types.optional(types.string, ""),
    aloitusPvm: types.optional(types.string, ""),
    keskeytysPvm: types.optional(types.string, ""),
    aiemmatOpinnot: types.array(Opinto),
    opinnot: types.array(Opinto)
  })
  .views(self => {
    return {
      get suunnitellutOpinnot() {
        return self.opinnot.filter(opinto => opinto.tila === "suunniteltu")
      },
      get aikataulutetutOpinnot() {
        return self.opinnot.filter(opinto => opinto.tila === "aikataulutettu")
      },
      get valmiitOpinnot() {
        return self.opinnot.filter(opinto => opinto.tila === "valmis")
      }
    }
  })
