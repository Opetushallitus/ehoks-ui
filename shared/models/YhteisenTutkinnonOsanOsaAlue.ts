import { types } from "mobx-state-tree"
import { OsaamisenHankkimistapa } from "./OsaamisenHankkimistapa"
import { OsaamisenOsoittaminen } from "./OsaamisenOsoittaminen"
import { HankittavatTutkinnonOsatViews } from "./helpers/HankittavatTutkinnonOsatViews"
import { EnrichKoodiUri } from "models/EnrichKoodiUri"
import { KoodistoVastaus } from "models/KoodistoVastaus"
import { Oppilaitoshenkilo } from "./Oppilaitoshenkilo"
import { EnrichOrganisaatioOid } from "./EnrichOrganisaatioOid"

const Model = types.model("YhteisenTutkinnonOsanOsaAlue", {
  id: types.optional(types.number, 0),
  osaAlueKoodiUri: types.optional(types.string, ""),
  osaAlue: types.optional(KoodistoVastaus, {}),
  osaamisenHankkimistavat: types.array(OsaamisenHankkimistapa),
  vaatimuksistaTaiTavoitteistaPoikkeaminen: types.optional(types.string, ""),
  osaamisenOsoittaminen: types.array(OsaamisenOsoittaminen),
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  koulutuksenJarjestaja: types.maybe(Oppilaitoshenkilo),
  olennainenSeikka: types.optional(types.boolean, false)
})

export const YhteisenTutkinnonOsanOsaAlue = types
  .compose(
    EnrichKoodiUri,
    Model,
    EnrichOrganisaatioOid("koulutuksenJarjestajaOid"),
    HankittavatTutkinnonOsatViews
  )
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
