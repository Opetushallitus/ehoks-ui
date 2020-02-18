import { types } from "mobx-state-tree"
import { Harjoittelujakso } from "models/helpers/TutkinnonOsa"
import { HOKS } from "models/HOKS"

export const Oppija = types
  .model("Oppija", {
    nimi: types.optional(types.string, ""),
    hoks: types.optional(HOKS, {})
  })
  .views(self => {
    return {
      get harjoittelujakso(): Harjoittelujakso {
        const { hankittavatTutkinnonOsat } = self.hoks
        return hankittavatTutkinnonOsat.length &&
          hankittavatTutkinnonOsat[0].harjoittelujaksot &&
          hankittavatTutkinnonOsat[0].harjoittelujaksot.length
          ? hankittavatTutkinnonOsat[0].harjoittelujaksot[0]
          : {}
      }
    }
  })
