import { types } from "mobx-state-tree"
import { OsaamisenHankkimistapa } from "./OsaamisenHankkimistapa"
import { OsaamisenOsoittaminen } from "./OsaamisenOsoittaminen"
import { HankittavatTutkinnonOsatViews } from "./helpers/HankittavatTutkinnonOsatViews"

const Model = types.model("HankittavaPaikallinenTutkinnonOsaModel", {
  id: types.optional(types.number, 0),
  tavoitteetJaSisallot: types.optional(types.string, ""),
  osaamisenOsoittaminen: types.array(OsaamisenOsoittaminen),
  olennainenSeikka: types.optional(types.boolean, false),
  osaamisenHankkimistavat: types.array(OsaamisenHankkimistapa),
  vaatimuksistaTaiTavoitteistaPoikkeaminen: types.optional(types.string, ""),
  nimi: types.optional(types.string, ""),
  laajuus: types.optional(types.number, 0),
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  amosaaTunniste: types.optional(types.string, "")
})

export const HankittavaPaikallinenTutkinnonOsa = types
  .compose(
    "HankittavaPaikallinenTutkinnonOsaModel",
    Model,
    HankittavatTutkinnonOsatViews
  )
  .views(self => {
    return {
      get otsikko() {
        return self.nimi
      },
      get osaamispisteet() {
        return self.laajuus
      }
    }
  })
