import { types } from "mobx-state-tree"
import { getOtsikko } from "./helpers/getOtsikko"

export const OlemassaOlevaPaikallinenTutkinnonOsa = types
  .model("OlemassaOlevaPaikallinenTutkinnonOsa", {
    id: types.optional(types.number, 0),
    tavoitteetJaSisallot: types.optional(types.string, ""),
    vaatimuksistaTaiTavoitteistaPoikkeaminen: types.optional(types.string, ""),
    nimi: types.optional(types.string, ""),
    laajuus: types.optional(types.number, 0),
    koulutuksenJarjestajaOid: types.optional(types.string, ""),
    amosaaTunniste: types.optional(types.string, "")
  })
  .views(self => {
    return {
      get otsikko() {
        return self.nimi
      },
      get osaamispisteet() {
        // TODO: get from ePerusteet call
        return 0
      },
      get naytot() {
        return []
      },
      opintoOtsikko(ospLyhenne: string): string {
        return getOtsikko(this, ospLyhenne)
      }
    }
  })
