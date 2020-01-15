import { types, Instance, getEnv, flow, getRoot } from "mobx-state-tree"
import { AiemminHankittuAmmatillinenTutkinnonOsa } from "models/AiemminHankittuAmmatillinenTutkinnonOsa"
import { AiemminHankittuPaikallinenTutkinnonOsa } from "models/AiemminHankittuPaikallinenTutkinnonOsa"
import { AiemminHankittuYhteinenTutkinnonOsa } from "models/AiemminHankittuYhteinenTutkinnonOsa"
import { HankittavaAmmatillinenTutkinnonOsa } from "models/HankittavaAmmatillinenTutkinnonOsa"
import { HankittavaPaikallinenTutkinnonOsa } from "models/HankittavaPaikallinenTutkinnonOsa"
import { HankittavaYhteinenTutkinnonOsa } from "models/HankittavaYhteinenTutkinnonOsa"
import { TutkinnonOsa, HankittavaTutkinnonOsa } from "./helpers/TutkinnonOsa"
import flattenDeep from "lodash.flattendeep"
import { YhteisenTutkinnonOsanOsaAlue } from "models/YhteisenTutkinnonOsanOsaAlue"
import { EnrichKoodiUri } from "models/EnrichKoodiUri"
import { KoodistoVastaus } from "models/KoodistoVastaus"
import { StoreEnvironment } from "types/StoreEnvironment"
import { Opiskeluoikeus } from "models/Opiskeluoikeus"
import { LocaleRoot } from "models/helpers/LocaleRoot"
import find from "lodash.find"
import { APIResponse } from "types/APIResponse"
import { OpiskeluvalmiuksiaTukevatOpinnot } from "./OpiskeluvalmiuksiaTukevatOpinnot"
import { AiemminHankitunYTOOsaAlue } from "./AiemminHankitunYTOOsaAlue"

const Model = types.model("HOKSModel", {
  eid: types.optional(types.string, ""),
  id: types.optional(types.number, 0),
  ensikertainenHyvaksyminen: types.optional(types.string, ""),
  hyvaksytty: types.optional(types.string, ""),
  luotu: types.optional(types.string, ""),
  aiemminHankitutAmmatTutkinnonOsat: types.array(
    AiemminHankittuAmmatillinenTutkinnonOsa
  ),
  aiemminHankitutPaikallisetTutkinnonOsat: types.array(
    AiemminHankittuPaikallinenTutkinnonOsa
  ),
  aiemminHankitutYhteisetTutkinnonOsat: types.array(
    AiemminHankittuYhteinenTutkinnonOsa
  ),
  opiskeluoikeusOid: types.optional(types.string, ""),
  opiskeluOikeus: types.optional(Opiskeluoikeus, {}),
  oppijaOid: types.optional(types.string, ""),
  osaamisenHankkimisenTarve: types.maybeNull(types.boolean),
  paivitetty: types.optional(types.string, ""),
  hankittavatAmmatTutkinnonOsat: types.array(
    HankittavaAmmatillinenTutkinnonOsa
  ),
  hankittavatPaikallisetTutkinnonOsat: types.array(
    HankittavaPaikallinenTutkinnonOsa
  ),
  hankittavatYhteisetTutkinnonOsat: types.array(HankittavaYhteinenTutkinnonOsa),
  opiskeluvalmiuksiaTukevatOpinnot: types.array(OpiskeluvalmiuksiaTukevatOpinnot),
  urasuunnitelmaKoodiUri: types.optional(types.string, ""),
  urasuunnitelma: types.optional(KoodistoVastaus, {}),
  versio: types.optional(types.number, 0),
  sahkoposti: types.optional(types.string, ""),
  manuaalisyotto: types.optional(types.boolean, false)
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
    const { apiUrl, apiPrefix, errors, fetchCollection, fetchSingle, callerId } = getEnv<
      StoreEnvironment
    >(self)

    // fetches detailed HOKS, only needed in virkailija app
    const fetchDetails = flow(function*(): any {
      const response: APIResponse = yield fetchSingle(
        apiUrl(`${apiPrefix}/oppijat/${self.oppijaOid}/hoksit/${self.id}`),
        { headers: callerId() }
      )
      const keys = Object.keys(response.data)
      keys.forEach(key => {
        self[key] = response.data[key]
      })
    })

    const fetchTutkinto = flow(function*(): any {
      const diaarinumero =
        self.opiskeluOikeus.suoritukset[0].koulutusmoduuli.perusteenDiaarinumero
      const response: APIResponse = yield fetchSingle(
        apiUrl(
          `${apiPrefix}/external/eperusteet/tutkinnot?diaarinumero=${diaarinumero}`
        )
      )
      const { id, suoritustavat } = response.data
      const suoritustapa = suoritustavat.reduce(
        (
          result: "ops" | "reformi" | "",
          tapa: { suoritustapakoodi: "ops" | "reformi" }
        ) => {
          if (tapa.suoritustapakoodi === "ops") {
            result = "ops"
          } else if (tapa.suoritustapakoodi === "reformi") {
            result = "reformi"
          }
          return result
        },
        ""
      )
      return { id, suoritustapa }
    })

    const fetchRakenne = flow(function*(
      id: string,
      suoritustapa: string = "reformi"
    ): any {
      const response: APIResponse = yield fetchSingle(
        apiUrl(
          `${apiPrefix}/external/eperusteet/tutkinnot/${id}/suoritustavat/${suoritustapa}/${
            suoritustapa === "reformi" ? "rakenne" : "tutkinnonosat"
          }`
        )
      )
      return response.data
    })

    function getOsaamispisteetFromRakenne(rakenne: any) {
      if(rakenne.muodostumisSaanto?.laajuus){
        return rakenne.muodostumisSaanto.laajuus.minimi
      }
      return null
    }

    const fetchOpiskeluoikeudet = flow(function*(): any {
      if (!self.oppijaOid) {
        return
      }
      try {
        const response = yield fetchCollection(
          apiUrl(`${apiPrefix}/oppijat/${self.oppijaOid}/opiskeluoikeudet`),
          { headers: callerId() }
        )
        const opiskeluOikeudet: APIResponse = response.data || []
        const opiskeluOikeus = find(
          opiskeluOikeudet,
          (oo: any) => oo.oid === self.opiskeluoikeusOid
        )

        if (opiskeluOikeus !== undefined) {
          if (opiskeluOikeus.tyyppi.koodiarvo !== "ammatillinenkoulutus") {
            throw new Error("HOKS.fetchOpiskeluoikeudet.wrongType")
          }

          self.opiskeluOikeus = opiskeluOikeus
          const tutkinto = yield fetchTutkinto()
          const rakenne = yield fetchRakenne(tutkinto.id, tutkinto.suoritustapa)
          self.osaamispisteet = getOsaamispisteetFromRakenne(rakenne)
        }
      } catch (error) {
        errors.logError("HOKS.fetchOpiskeluoikeudet", error.message)
      }
    })

    return { fetchDetails, fetchOpiskeluoikeudet }
  })
  .views(self => {
    const root: LocaleRoot = getRoot(self)
    return {
      get hankittavatTutkinnonOsat(): HankittavaTutkinnonOsa[] {
        const osaAlueet = flattenDeep<
          Instance<typeof YhteisenTutkinnonOsanOsaAlue>
        >(self.hankittavatYhteisetTutkinnonOsat.map((to: any) => to.osaAlueet))
        return [
          ...self.hankittavatAmmatTutkinnonOsat,
          ...self.hankittavatPaikallisetTutkinnonOsat,
          // treat osaAlue as tutkinnonOsa for hankittavatYhteisetTutkinnonOsat
          ...osaAlueet
        ]
      },
      get aiemminHankitutTutkinnonOsat(): TutkinnonOsa[] {
        const osaAlueet = flattenDeep<
          Instance<typeof AiemminHankitunYTOOsaAlue>
          >(self.aiemminHankitutYhteisetTutkinnonOsat.map((to: any) => to.osaAlueet))

        return [
          ...self.aiemminHankitutAmmatTutkinnonOsat,
          ...self.aiemminHankitutPaikallisetTutkinnonOsat,
          // treat osaAlue as tutkinnonOsa for aiemminHankitutYhteisetTutkinnonOsat
          ...self.aiemminHankitutYhteisetTutkinnonOsat
          // ...osaAlueet
        ]
      },
      get suunnitellutOpinnot() {
        return this.hankittavatTutkinnonOsat.filter(
          to => to.tila === "suunniteltu"
        )
      },
      get aikataulutetutOpinnot() {
        return this.hankittavatTutkinnonOsat.filter(
          to => to.tila === "aikataulutettu"
        )
      },
      get aloitusPvm() {
        return self.opiskeluOikeus.alkamispaiva
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
          ? self.opiskeluOikeus.suoritukset[0].koulutusmoduuli.nimi
          : ""
      },
      get valmiitOpinnot() {
          return this.hankittavatTutkinnonOsat.filter(to => to.tila === "valmis")
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
