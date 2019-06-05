import { types, Instance, getEnv, flow, getRoot } from "mobx-state-tree"
import { Henkilo } from "models/Henkilo"
import { OlemassaOlevaAmmatillinenTutkinnonOsa } from "models/OlemassaOlevaAmmatillinenTutkinnonOsa"
import { OlemassaOlevaPaikallinenTutkinnonOsa } from "models/OlemassaOlevaPaikallinenTutkinnonOsa"
import { OlemassaOlevaYhteinenTutkinnonOsa } from "models/OlemassaOlevaYhteinenTutkinnonOsa"
import { PuuttuvaAmmatillinenTutkinnonOsa } from "models/PuuttuvaAmmatillinenTutkinnonOsa"
import { PuuttuvaPaikallinenTutkinnonOsa } from "models/PuuttuvaPaikallinenTutkinnonOsa"
import { PuuttuvaYhteinenTutkinnonOsa } from "models/PuuttuvaYhteinenTutkinnonOsa"
import { TutkinnonOsa } from "./helpers/TutkinnonOsa"
import flattenDeep from "lodash.flattendeep"
import { OppijaYhteisenTutkinnonOsanOsaAlue } from "models/OppijaYhteisenTutkinnonOsanOsaAlue"
import { EnrichKoodiUri } from "models/EnrichKoodiUri"
import { KoodistoVastaus } from "models/KoodistoVastaus"
import { StoreEnvironment } from "types/StoreEnvironment"
import { Opiskeluoikeus } from "models/Opiskeluoikeus"
import { LocaleRoot } from "models/helpers/LocaleRoot"
import find from "lodash.find"

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
  opiskeluOikeus: types.optional(Opiskeluoikeus, {}),
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
  .volatile(_ => ({
    osaamispisteet: 0
  }))
  .actions(self => {
    const { apiUrl, apiPrefix, errors, fetchCollection, fetchSingle } = getEnv<
      StoreEnvironment
    >(self)

    const fetchTutkinto = flow(function*() {
      const diaarinumero =
        self.opiskeluOikeus.suoritukset[0].koulutusmoduuli.perusteenDiaarinumero
      const response = yield fetchSingle(
        apiUrl(
          `${apiPrefix}/external/eperusteet/tutkinnot?diaarinumero=${diaarinumero}`
        )
      )
      return response.data
    })

    const fetchRakenne = flow(function*(id: string) {
      const response = yield fetchSingle(
        apiUrl(
          `${apiPrefix}/external/eperusteet/tutkinnot/${id}/suoritustavat/reformi/rakenne`
        )
      )
      return response.data
    })

    const fetchOpiskeluoikeudet = flow(function*() {
      if (!self.oppijaOid) {
        return
      }
      try {
        const response = yield fetchCollection(
          apiUrl(`${apiPrefix}/oppijat/${self.oppijaOid}/opiskeluoikeudet`)
        )
        const opiskeluOikeudet = response.data || []
        const opiskeluOikeus = find(
          opiskeluOikeudet,
          (oo: any) => oo.oid === self.opiskeluoikeusOid
        )
        if (opiskeluOikeus !== undefined) {
          self.opiskeluOikeus = opiskeluOikeus
          const tutkinto = yield fetchTutkinto()
          const rakenne = yield fetchRakenne(tutkinto.id)
          self.osaamispisteet = rakenne.osat.reduce((osp: number, osa: any) => {
            osp += osa.muodostumisSaanto.laajuus.minimi
            return osp
          }, 0)
        }
      } catch (error) {
        errors.logError("HOKS.fetchOpiskeluoikeudet", error.message)
      }
    })

    return { fetchOpiskeluoikeudet }
  })
  .actions(self => ({
    afterCreate() {
      self.fetchOpiskeluoikeudet()
    }
  }))
  .views(self => {
    const root: LocaleRoot = getRoot(self)
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
      get olemassaOlevatTutkinnonOsat(): TutkinnonOsa[] {
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
      get oppilaitos() {
        return self.opiskeluOikeus.oppilaitos
          ? self.opiskeluOikeus.oppilaitos.nimi[root.translations.activeLocale]
          : ""
      },
      get osaamisala() {
        return self.opiskeluOikeus.suoritukset &&
          self.opiskeluOikeus.suoritukset.length &&
          self.opiskeluOikeus.suoritukset[0].osaamisala.length
          ? self.opiskeluOikeus.suoritukset[0].osaamisala[0].osaamisala.nimi[
              root.translations.activeLocale
            ]
          : ""
      },
      get tutkinnonNimi() {
        return self.opiskeluOikeus.suoritukset.length
          ? self.opiskeluOikeus.suoritukset[0].koulutusmoduuli.perusteenNimi[
              root.translations.activeLocale
            ]
          : ""
      },
      get tutkintonimike() {
        return self.opiskeluOikeus.suoritukset &&
          self.opiskeluOikeus.suoritukset.length &&
          self.opiskeluOikeus.suoritukset[0].tutkintonimike.length
          ? self.opiskeluOikeus.suoritukset[0].tutkintonimike[0].nimi[
              root.translations.activeLocale
            ]
          : ""
      },
      get keskeytysPvm() {
        // TODO: where do we get this value?
        return ""
      },
      get paattymispaiva() {
        return self.opiskeluOikeus.paattymispaiva
      }
    }
  })

export interface IHOKS extends Instance<typeof HOKS> {}
