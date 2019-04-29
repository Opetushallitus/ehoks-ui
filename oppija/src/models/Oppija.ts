import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
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
        const { puuttuvatTutkinnonOsat } = self.hoks
        return puuttuvatTutkinnonOsat.length &&
          puuttuvatTutkinnonOsat[0].harjoittelujaksot.length
          ? self.hoks.puuttuvatTutkinnonOsat[0].harjoittelujaksot[0]
          : {}
      },
      get ajankohta() {
        if (!this.harjoittelujakso.alku || !this.harjoittelujakso.loppu) {
          return ""
        }
        return [
          format(parseISO(this.harjoittelujakso.alku || ""), "d.M."),
          format(parseISO(this.harjoittelujakso.loppu || ""), "d.M.yyyy")
        ].join("-")
      },
      get oppijanOtsikko(): string {
        return `${self.nimi}, ${this.harjoittelujakso.selite} ${this.ajankohta}`
      }
    }
  })
