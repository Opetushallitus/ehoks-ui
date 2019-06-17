import { types } from "mobx-state-tree"
import { getOtsikko } from "./helpers/getOtsikko"

export const AiemminHankittuPaikallinenTutkinnonOsa = types
  .model("AiemminHankittuPaikallinenTutkinnonOsa", {
    id: types.optional(types.number, 0),
    tavoitteetJaSisallot: types.optional(types.string, ""),
    vaatimuksistaTaiTavoitteistaPoikkeaminen: types.optional(types.string, ""),
    nimi: types.optional(types.string, ""),
    laajuus: types.optional(types.number, 0),
    koulutuksenJarjestajaOid: types.optional(types.string, ""),
    amosaaTunniste: types.optional(types.string, ""),
    olennainenSeikka: types.optional(types.boolean, false)
  })
  .views(self => {
    return {
      get otsikko() {
        return self.nimi
      },
      get osaamispisteet() {
        return self.laajuus
      },
      get naytot() {
        return []
      },
      opintoOtsikko(ospLyhenne: string): string {
        return getOtsikko(this, ospLyhenne)
      }
    }
  })
