import { types, getRoot } from "mobx-state-tree"
import { OsaamisenOsoittaminen } from "./OsaamisenOsoittaminen"
import { TodennettuArviointiLisatiedot } from "./TodennettuArviointiLisatiedot"
import { AiemminHankitunYTOOsaAlue } from "./AiemminHankitunYTOOsaAlue"
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
import { KoodistoVastaus } from "models/KoodistoVastaus"

const Model = types.model({
  id: types.optional(types.number, 0),
  tutkinnonOsaKoodiUri: types.optional(types.string, ""),
  tutkinnonOsa: types.optional(EPerusteetVastaus, {}),
  tutkinnonOsaViitteet: types.array(TutkinnonOsaViite),
  koulutuksenJarjestajaOid: types.optional(types.string, ""),
  osaAlueet: types.array(AiemminHankitunYTOOsaAlue),
  valittuTodentamisenProsessiKoodiUri: types.optional(types.string, ""),
  valittuTodentamisenProsessi: types.optional(KoodistoVastaus, {}),
  tarkentavatTiedotNaytto: types.array(OsaamisenOsoittaminen),
  tarkentavatTiedotOsaamisenArvioija: types.optional(
    TodennettuArviointiLisatiedot,
    {}
  )
})

export const AiemminHankittuYhteinenTutkinnonOsa = types
  .compose(
    "AiemminHankittuYhteinenTutkinnonOsa",
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
      get todentamisenProsessi() {
        return {
          koodiUri: self.valittuTodentamisenProsessiKoodiUri,
          lahetettyArvioitavaksi:
            self.tarkentavatTiedotOsaamisenArvioija.lahetettyArvioitavaksi
        }
      },
      opintoOtsikko(ospLyhenne: string): string {
        return getOtsikko(this, ospLyhenne)
      }
    }
  })
