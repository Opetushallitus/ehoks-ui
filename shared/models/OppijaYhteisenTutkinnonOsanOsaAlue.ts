import { types } from "mobx-state-tree"
import { OsaamisenHankkimistapa } from "./OsaamisenHankkimistapa"
import { HankitunYTOOsaamisenNaytto } from "./HankitunYTOOsaamisenNaytto"
import { TutkinnonOsaViews } from "./helpers/TutkinnonOsaViews"
import { EnrichKoodiUri } from "models/EnrichKoodiUri"
import { KoodistoVastaus } from "models/KoodistoVastaus"

const Model = types.model("OppijaYhteisenTutkinnonOsanOsaAlue", {
  id: types.optional(types.number, 0),
  osaAlueKoodiUri: types.optional(types.string, ""),
  osaAlue: types.optional(KoodistoVastaus, {}),
  osaamisenHankkimistavat: types.array(OsaamisenHankkimistapa),
  vaatimuksistaTaiTavoitteistaPoikkeaminen: types.optional(types.string, ""),
  hankitunOsaamisenNaytto: types.array(HankitunYTOOsaamisenNaytto)
})

export const OppijaYhteisenTutkinnonOsanOsaAlue = types
  .compose(
    EnrichKoodiUri,
    Model,
    TutkinnonOsaViews
  )
  .views(self => {
    return {
      get otsikko() {
        return self.osaAlue ? self.osaAlue.nimi : ""
      },
      get osaamispisteet() {
        // TODO: get from ePerusteet call
        return 0
      },
      get osaamisvaatimukset() {
        // TODO
        return []
      },
      get harjoittelujaksot() {
        // TODO
        return []
      }
    }
  })
