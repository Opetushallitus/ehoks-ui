import { types } from "mobx-state-tree"
import { OsaamisenHankkimistapa } from "./OsaamisenHankkimistapa"
import { OsaamisenOsoittaminen } from "./OsaamisenOsoittaminen"
import { HankittavatTutkinnonOsatViews } from "./helpers/HankittavatTutkinnonOsatViews"
import { EnrichKoodiUri } from "models/EnrichKoodiUri"
import { KoodistoVastaus } from "models/KoodistoVastaus"

const Model = types.model("YhteisenTutkinnonOsanOsaAlue", {
  id: types.optional(types.number, 0),
  osaAlueKoodiUri: types.optional(types.string, ""),
  osaAlue: types.optional(KoodistoVastaus, {}),
  osaamisenHankkimistavat: types.array(OsaamisenHankkimistapa),
  vaatimuksistaTaiTavoitteistaPoikkeaminen: types.optional(types.string, ""),
  osaamisenOsoittaminen: types.array(OsaamisenOsoittaminen),
  olennainenSeikka: types.optional(types.boolean, false)
})

export const YhteisenTutkinnonOsanOsaAlue = types
  .compose(EnrichKoodiUri, Model, HankittavatTutkinnonOsatViews)
  .views(self => {
    return {
      get otsikko() {
        return self.osaAlue ? self.osaAlue.nimi : ""
      },
      get osaamispisteet() {
        // TODO: where do we get this? Fix this also to AiemminHankitunYTOOsaAlue.ts
        return 0
      }
    }
  })
