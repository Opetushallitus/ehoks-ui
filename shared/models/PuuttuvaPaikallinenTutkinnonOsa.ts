import { types } from "mobx-state-tree"
import { OsaamisenHankkimistapa } from "./OsaamisenHankkimistapa"
import { HankitunPaikallisenOsaamisenNaytto } from "./HankitunPaikallisenOsaamisenNaytto"
import { TutkinnonOsaViews } from "./helpers/TutkinnonOsaViews"

const Model = types.model("PuuttuvaPaikallinenTutkinnonOsaModel", {
  id: types.optional(types.number, 0),
  tavoitteetJaSisallot: types.optional(types.string, ""),
  hankitunOsaamisenNaytto: types.array(HankitunPaikallisenOsaamisenNaytto),
  osaamisenHankkimistavat: types.array(OsaamisenHankkimistapa),
  vaatimuksistaTaiTavoitteistaPoikkeaminen: types.optional(types.string, ""),
  nimi: types.optional(types.string, ""),
  laajuus: types.optional(types.number, 0),
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  amosaaTunniste: types.optional(types.string, "")
})

export const PuuttuvaPaikallinenTutkinnonOsa = types
  .compose(
    "PuuttuvaPaikallinenTutkinnonOsa",
    Model,
    TutkinnonOsaViews
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
