import { types } from "mobx-state-tree"
import { Harjoittelujakso } from "./Harjoittelujakso"
import { Osaamisvaatimus } from "./Osaamisvaatimus"
import { Naytto } from "./Naytto"

export const Opinto = types.model("Opinto", {
  id: types.optional(types.number, 0),
  osaamisvaatimukset: types.array(Osaamisvaatimus),
  naytot: types.array(Naytto),
  otsikko: types.optional(types.string, ""),
  osaamispisteet: types.optional(types.number, 0),
  sijainnit: types.array(types.string),
  harjoittelujaksot: types.array(Harjoittelujakso),
  tila: types.maybeNull(
    types.enumeration(["suunniteltu", "aikataulutettu", "valmis"])
  )
})
