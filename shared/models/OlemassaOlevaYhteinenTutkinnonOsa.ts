import { types, getRoot } from "mobx-state-tree"
import { HankitunOsaamisenNaytto } from "./HankitunOsaamisenNaytto"
import { TodennettuArviointiLisatiedot } from "./TodennettuArviointiLisatiedot"
import { OlemassaOlevanYTOOsaAlue } from "./OlemassaOlevanYTOOsaAlue"
import { getNaytot } from "./helpers/getNaytot"
import { getOtsikko } from "./helpers/getOtsikko"
import { getSijainnit } from "./helpers/getSijainnit"
import flattenDeep from "lodash.flattendeep"
import { EnrichKoodiUri } from "models/EnrichKoodiUri"
import { EPerusteetVastaus } from "models/EPerusteetVastaus"
import { LocaleRoot } from "models/helpers/LocaleRoot"

const Model = types.model({
  id: types.optional(types.number, 0),
  tutkinnonOsaKoodiUri: types.optional(types.string, ""),
  tutkinnonOsa: types.optional(EPerusteetVastaus, {}),
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
        // TODO: get from ePerusteet call
        return 0
      },
      get naytot() {
        return [
          ...getNaytot(self.tarkentavatTiedotNaytto),
          // we need to include näytöt from osa-alueet as well
          flattenDeep(
            self.osaAlueet.map(osaAlue =>
              getNaytot(osaAlue.tarkentavatTiedotNaytto)
            )
          )
        ]
      },
      get sijainnit() {
        return getSijainnit(self.tarkentavatTiedotNaytto, [])
      },
      opintoOtsikko(ospLyhenne: string): string {
        return getOtsikko(this, ospLyhenne)
      }
    }
  })
