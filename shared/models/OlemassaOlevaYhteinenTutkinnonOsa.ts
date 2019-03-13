import { types, getRoot } from "mobx-state-tree"
import { HankitunOsaamisenNaytto } from "./HankitunOsaamisenNaytto"
import { TodennettuArviointiLisatiedot } from "./TodennettuArviointiLisatiedot"
import { OlemassaOlevanYTOOsaAlue } from "./OlemassaOlevanYTOOsaAlue"
import { getNaytot } from "./helpers/getNaytot"
import { getOtsikko } from "./helpers/getOtsikko"
import flattenDeep from "lodash.flattendeep"
import { EnrichKoodiUri } from "models/EnrichKoodiUri"
import { EPerusteetVastaus } from "models/EPerusteetVastaus"
import { LocaleRoot } from "models/helpers/LocaleRoot"
import { Naytto } from "models/helpers/TutkinnonOsa"
import { EnrichTutkinnonOsa } from "models/EnrichTutkinnonOsa"
import { TutkinnonOsaViite } from "models/TutkinnonOsaViite"
import { getOsaamispisteet } from "models/helpers/getOsaamispisteet"

const Model = types.model({
  id: types.optional(types.number, 0),
  tutkinnonOsaKoodiUri: types.optional(types.string, ""),
  tutkinnonOsa: types.optional(EPerusteetVastaus, {}),
  tutkinnonOsaViitteet: types.array(TutkinnonOsaViite),
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  osaAlueet: types.array(OlemassaOlevanYTOOsaAlue),
  valittuTodentamisenProsessiKoodiUri: types.optional(types.string, ""),
  tarkentavatTiedotNaytto: types.array(HankitunOsaamisenNaytto),
  tarkentavatTiedotArvioija: types.optional(TodennettuArviointiLisatiedot, {})
})

export const OlemassaOlevaYhteinenTutkinnonOsa = types
  .compose(
    "OlemassaOlevaYhteinenTutkinnonOsa",
    EnrichKoodiUri,
    EnrichTutkinnonOsa("tutkinnonOsaViitteet"),
    Model
  )
  .views(self => {
    const root: LocaleRoot = getRoot(self)
    return {
      get otsikko() {
        return self.tutkinnonOsa && self.tutkinnonOsa.nimi
          ? self.tutkinnonOsa.nimi[root.translations.activeLocale]
          : ""
      },
      get osaamispisteet() {
        return getOsaamispisteet(self.tutkinnonOsaViitteet)
      },
      get naytot(): Naytto[] {
        return [
          ...getNaytot(self.tarkentavatTiedotNaytto),
          // we need to include näytöt from osa-alueet as well
          ...flattenDeep<Naytto>(
            self.osaAlueet.map(osaAlue =>
              getNaytot(osaAlue.tarkentavatTiedotNaytto)
            )
          )
        ]
      },

      opintoOtsikko(ospLyhenne: string): string {
        return getOtsikko(this, ospLyhenne)
      }
    }
  })
