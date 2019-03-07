import { types, Instance } from "mobx-state-tree"
import { Henkilo } from "models/Henkilo"
import { OlemassaOlevaAmmatillinenTutkinnonOsa } from "models/OlemassaOlevaAmmatillinenTutkinnonOsa"
import { OlemassaOlevaPaikallinenTutkinnonOsa } from "models/OlemassaOlevaPaikallinenTutkinnonOsa"
import { OlemassaOlevaYhteinenTutkinnonOsa } from "models/OlemassaOlevaYhteinenTutkinnonOsa"
import { PuuttuvaAmmatillinenTutkinnonOsa } from "models/PuuttuvaAmmatillinenTutkinnonOsa"
import { PuuttuvaPaikallinenTutkinnonOsa } from "models/PuuttuvaPaikallinenTutkinnonOsa"
import { PuuttuvaYhteinenTutkinnonOsa } from "models/PuuttuvaYhteinenTutkinnonOsa"
import { TutkinnonOsa } from "./helpers/TutkinnonOsa"
import flattenDeep from "lodash.flattendeep"
import { OppijaYhteisenTutkinnonOsanOsaAlue } from "../../shared/models/OppijaYhteisenTutkinnonOsanOsaAlue"
import { EnrichKoodiUri } from "models/EnrichKoodiUri"
import { KoodistoVastaus } from "models/KoodistoVastaus"

const Model = types.model("HOKSModel", {
  eid: types.optional(types.string, ""),
  ensikertainenHyvaksyminen: types.optional(types.string, ""),
  hyvaksyja: types.optional(Henkilo, {}),
  hyvaksytty: types.optional(types.string, ""),
  laatija: types.optional(Henkilo, {}),
  luotu: types.optional(types.string, ""),
  olemassaOlevatAmmatillisetTutkinnonOsat: types.array(
    OlemassaOlevaAmmatillinenTutkinnonOsa
  ),
  olemassaOlevatPaikallisetTutkinnonOsat: types.array(
    OlemassaOlevaPaikallinenTutkinnonOsa
  ),
  olemassaOlevatYhteisetTutkinnonOsat: types.array(
    OlemassaOlevaYhteinenTutkinnonOsa
  ),
  opiskeluoikeusOid: types.optional(types.string, ""),
  oppijaOid: types.optional(types.string, ""),
  paivitetty: types.optional(types.string, ""),
  paivittaja: types.optional(Henkilo, {}),
  puuttuvatAmmatillisetTutkinnonOsat: types.array(
    PuuttuvaAmmatillinenTutkinnonOsa
  ),
  puuttuvatPaikallisetTutkinnonOsat: types.array(
    PuuttuvaPaikallinenTutkinnonOsa
  ),
  puuttuvatYhteisetTutkinnonOsat: types.array(PuuttuvaYhteinenTutkinnonOsa),
  urasuunnitelmaKoodiUri: types.optional(types.string, ""),
  urasuunnitelma: types.optional(KoodistoVastaus, {}),
  versio: types.optional(types.number, 0)
})

export const HOKS = types
  .compose(
    "HOKS",
    EnrichKoodiUri,
    Model
  )
  .views(self => {
    return {
      get puuttuvatTutkinnonOsat(): TutkinnonOsa[] {
        const osaAlueet = flattenDeep<
          Instance<typeof OppijaYhteisenTutkinnonOsanOsaAlue>
        >(self.puuttuvatYhteisetTutkinnonOsat.map(to => to.osaAlueet))
        return [
          ...self.puuttuvatAmmatillisetTutkinnonOsat,
          ...self.puuttuvatPaikallisetTutkinnonOsat,
          // treat osaAlue as tutkinnonOsa for puuttuvatYhteisetTutkinnonOsat
          ...osaAlueet
        ]
      },
      get olemassaOlevatTutkinnonOsat() {
        return [
          ...self.olemassaOlevatAmmatillisetTutkinnonOsat,
          ...self.olemassaOlevatPaikallisetTutkinnonOsat,
          ...self.olemassaOlevatYhteisetTutkinnonOsat
        ]
      },
      get suunnitellutOpinnot() {
        return this.puuttuvatTutkinnonOsat.filter(
          to => to.tila === "suunniteltu"
        )
      },
      get aikataulutetutOpinnot() {
        return this.puuttuvatTutkinnonOsat.filter(
          to => to.tila === "aikataulutettu"
        )
      },
      get valmiitOpinnot() {
        return this.puuttuvatTutkinnonOsat.filter(to => to.tila === "valmis")
      },
      get aloitusPvm() {
        return self.ensikertainenHyvaksyminen
      },
      get keskeytysPvm() {
        // TODO: get from enriched opiskeluoikeus object
        return ""
      },
      get oppilaitos() {
        // TODO: get from enriched opiskeluoikeus object
        return ""
      },
      get osaamisala() {
        // TODO: where do we get this value?
        return ""
      },
      get osaamispisteet() {
        // TODO: where do we get this value?
        return 0
      },
      get tutkinnonNimi() {
        // TODO: where do we get this value?
        return ""
      },
      get tutkintonimike() {
        // TODO: where do we get this value?
        return ""
      }
    }
  })
