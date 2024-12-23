import { types, Instance, getEnv, flow, getRoot } from "mobx-state-tree"
import { AiemminHankittuAmmatillinenTutkinnonOsa } from "models/AiemminHankittuAmmatillinenTutkinnonOsa"
import { AiemminHankittuPaikallinenTutkinnonOsa } from "models/AiemminHankittuPaikallinenTutkinnonOsa"
import { AiemminHankittuYhteinenTutkinnonOsa } from "models/YhteinenTutkinnonOsa/AiemminHankittuYhteinenTutkinnonOsa"
import { HankittavaAmmatillinenTutkinnonOsa } from "models/HankittavaAmmatillinenTutkinnonOsa"
import { HankittavaPaikallinenTutkinnonOsa } from "models/HankittavaPaikallinenTutkinnonOsa"
import { HankittavaYhteinenTutkinnonOsa } from "models/YhteinenTutkinnonOsa/HankittavaYhteinenTutkinnonOsa"
import { HankittavaKoulutuksenOsa } from "models/HankittavaKoulutuksenOsa"
import {
  IHankittavaTutkinnonOsa,
  IAiemminHankittuTutkinnonOsa
} from "./helpers/TutkinnonOsa"
import flattenDeep from "lodash.flattendeep"
import { YhteisenTutkinnonOsanOsaAlue } from "models/YhteinenTutkinnonOsa/YhteisenTutkinnonOsanOsaAlue"
import { KoodistoVastaus } from "models/KoodistoVastaus"
import { StoreEnvironment } from "types/StoreEnvironment"
import { IOsaamisala, Opiskeluoikeus } from "models/Opiskeluoikeus"
import { LocaleRoot } from "models/helpers/LocaleRoot"
import find from "lodash.find"
import maxBy from "lodash.maxby"
import { APIResponse } from "types/APIResponse"
import { OpiskeluvalmiuksiaTukevatOpinnot } from "./OpiskeluvalmiuksiaTukevatOpinnot"
import { AiemminHankitunYTOOsaAlue } from "./YhteinenTutkinnonOsa/AiemminHankitunYTOOsaAlue"
import { EnrichKoodistoKoodiUri } from "./Enrichment/EnrichKoodistoKoodiUri"
import { OpiskelijapalauteTila } from "./OpiskelijapalauteTila"
import { IRootStore } from "../../virkailija/src/stores/RootStore"
import { Locale } from "../stores/TranslationStore"
import { appendCommonHeaders } from "fetchUtils"

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
  osaamisenSaavuttamisenPvm: types.optional(types.string, ""),
  paivitetty: types.optional(types.string, ""),
  hankittavatAmmatTutkinnonOsat: types.array(
    HankittavaAmmatillinenTutkinnonOsa
  ),
  hankittavatPaikallisetTutkinnonOsat: types.array(
    HankittavaPaikallinenTutkinnonOsa
  ),
  hankittavatYhteisetTutkinnonOsat: types.array(HankittavaYhteinenTutkinnonOsa),
  hankittavatKoulutuksenOsat: types.array(HankittavaKoulutuksenOsa),
  opiskeluvalmiuksiaTukevatOpinnot: types.array(
    OpiskeluvalmiuksiaTukevatOpinnot
  ),
  urasuunnitelmaKoodiUri: types.optional(types.string, ""),
  urasuunnitelma: types.optional(KoodistoVastaus, {}),
  versio: types.optional(types.number, 0),
  sahkoposti: types.optional(types.string, ""),
  puhelinnumero: types.optional(types.string, ""),
  manuaalisyotto: types.optional(types.boolean, false),
  opiskelijapalauteTilat: types.array(OpiskelijapalauteTila)
})

export const HOKS = types
  .compose(
    "HOKS",
    EnrichKoodistoKoodiUri({
      enrichedProperty: "urasuunnitelma",
      koodiUriProperty: "urasuunnitelmaKoodiUri"
    }),
    Model
  )
  .volatile(() => ({
    osaamispisteet: 0
  }))
  .actions(self => {
    const root: IRootStore = getRoot(self)
    const {
      apiUrl,
      apiPrefix,
      errors,
      fetchCollection,
      fetchSingle,
      patchResource,
      appendCallerId
    } = getEnv<StoreEnvironment>(self)

    // fetches detailed HOKS, only needed in virkailija app
    const fetchDetails = flow(function* (): any {
      const response: APIResponse = yield fetchSingle(
        apiUrl(`${apiPrefix}/oppijat/${self.oppijaOid}/hoksit/${self.id}`),
        { headers: appendCallerId() }
      )
      const keys = Object.keys(response.data)
      keys.forEach(key => {
        self[key] = response.data[key]
      })
    })

    // fetches opiskelijapalauteTilat for HOKS, only needed in virkailija app
    const fetchOpiskelijapalauteTilat = flow(function* (): any {
      const response: APIResponse = yield fetchCollection(
        apiUrl(
          `${apiPrefix}/oppijat/${self.oppijaOid}/hoksit/${self.id}/opiskelijapalaute`
        ),
        { headers: appendCallerId() }
      )
      self.opiskelijapalauteTilat = response.data
    })

    const fetchTutkinto = flow(function* (): any {
      if (!self.opiskeluOikeus.oid.length) return

      const diaarinumero =
        self.opiskeluOikeus.suoritukset[0].koulutusmoduuli.perusteenDiaarinumero
      const response: APIResponse = yield fetchSingle(
        apiUrl(
          `${apiPrefix}/external/eperusteet/tutkinnot?diaarinumero=${diaarinumero}`
        ),
        { headers: appendCallerId() }
      )
      const { id, suoritustavat } = response.data
      const suoritustapa = suoritustavat?.reduce(
        (
          result: "ops" | "reformi" | undefined,
          tapa: { suoritustapakoodi: "ops" | "reformi" }
        ) => {
          if (tapa.suoritustapakoodi === "ops") {
            result = "ops"
          } else if (tapa.suoritustapakoodi === "reformi") {
            result = "reformi"
          }
          return result
        },
        undefined
      )
      return { id, suoritustapa }
    })

    const fetchRakenne = flow(function* (
      id: string,
      suoritustapa = "reformi"
    ): any {
      const response: APIResponse = yield fetchSingle(
        apiUrl(
          `${apiPrefix}/external/eperusteet/tutkinnot/${id}/suoritustavat/${suoritustapa}/${
            suoritustapa === "reformi" ? "rakenne" : "tutkinnonosat"
          }`
        ),
        { headers: appendCallerId() }
      )
      return response.data
    })

    function getOsaamispisteetFromRakenne(rakenne: any) {
      if (rakenne.muodostumisSaanto?.laajuus) {
        return rakenne.muodostumisSaanto.laajuus.minimi
      }
      return null
    }

    const fetchOsaamispisteet = flow(function* (): any {
      try {
        if (!self.opiskeluOikeus.oid.length) return

        const tutkinto = yield fetchTutkinto()
        if (tutkinto.id) {
          const rakenne = yield fetchRakenne(tutkinto.id, tutkinto.suoritustapa)
          self.osaamispisteet = getOsaamispisteetFromRakenne(rakenne)
        }
      } catch (error) {
        errors.logError("HOKS.fetchOsaamispisteet", error.message)
      }
    })

    const fetchOpiskeluoikeudet = flow(function* (): any {
      if (!self.oppijaOid) {
        return
      }
      try {
        const response = yield fetchCollection(
          apiUrl(`${apiPrefix}/oppijat/${self.oppijaOid}/opiskeluoikeudet`),
          { headers: appendCallerId() }
        )
        const opiskeluOikeudet: APIResponse = response.data || []
        const opiskeluOikeus = find(
          opiskeluOikeudet,
          (oo: any) => oo.oid === self.opiskeluoikeusOid
        )

        if (opiskeluOikeus) {
          if (
            opiskeluOikeus.tyyppi.koodiarvo === "ammatillinenkoulutus" ||
            opiskeluOikeus.tyyppi.koodiarvo === "tuva"
          ) {
            self.opiskeluOikeus = opiskeluOikeus
          } else {
            const activeLocale: Locale = root.translations.activeLocale
            const errorText =
              root.translations.messages[activeLocale][
                "errors.HOKS.fetchOpiskeluoikeudet.wrongType"
              ] ||
              "HOKSiin liitetty opiskeluoikeus ei ole ammatillinen tutkinto tai TUVA"
            throw new Error(errorText)
          }
        }
      } catch (error) {
        // Do not UI-log mobx-state-tree error
        // "Cannot read property 'mergeCache' of undefined"
        if (!error.message.toLowerCase().includes("cache")) {
          const oppija: APIResponse = yield fetchSingle(
            apiUrl(`virkailija/oppijat/${self.oppijaOid}`),
            { headers: appendCallerId() }
          )
          const errorMessage = `Oppija: ${oppija.data.nimi}, Oppija oid: ${self.oppijaOid}, Hoks id: ${self.id}, Error: ${error.message}`
          errors.logError("HOKS.fetchOpiskeluoikeudet", errorMessage)
        }
      }
    })

    const shallowDelete = flow(function* (): any {
      if (!self.oppijaOid) {
        return
      }
      try {
        const responseData = yield patchResource(
          apiUrl(
            `${apiPrefix}/oppijat/${self.oppijaOid}/hoksit/${self.id}/shallow-delete`
          ),
          {
            headers: appendCommonHeaders(
              new Headers({
                Accept: "application/json; charset=utf-8",
                "Content-Type": "application/json"
              })
            ),
            credentials: "include",
            body: JSON.stringify({
              "oppilaitos-oid": self.opiskeluOikeus?.oppilaitos?.oid || null
            })
          }
        )

        if (responseData.status === 200) {
          root.notifications.addNotifications([
            {
              title: "tavoitteet.PoistaHoksSuccess",
              default: "HOKSin poisto onnistui.",
              tyyppi: "success"
            }
          ])
        } else {
          errors.logError("HOKS.shallowDelete", responseData.body.error)
        }
      } catch (error) {
        errors.logError("HOKS.shallowDelete", error.message)
      }
    })

    return {
      fetchDetails,
      fetchOpiskeluoikeudet,
      fetchOpiskelijapalauteTilat,
      fetchOsaamispisteet,
      shallowDelete
    }
  })
  .views(self => {
    const root: LocaleRoot = getRoot(self)
    return {
      get hankittavatTutkinnonOsat(): IHankittavaTutkinnonOsa[] {
        const osaAlueet = flattenDeep<
          Instance<typeof YhteisenTutkinnonOsanOsaAlue>
        >(self.hankittavatYhteisetTutkinnonOsat.map((to: any) => to.osaAlueet))
        return [
          ...self.hankittavatAmmatTutkinnonOsat,
          ...self.hankittavatPaikallisetTutkinnonOsat,
          ...self.hankittavatKoulutuksenOsat,
          // treat osaAlue as tutkinnonOsa for hankittavatYhteisetTutkinnonOsat
          ...osaAlueet
        ]
      },
      get aiemminHankitutTutkinnonOsat(): IAiemminHankittuTutkinnonOsa[] {
        const osaAlueet = flattenDeep<
          Instance<typeof AiemminHankitunYTOOsaAlue>
        >(
          self.aiemminHankitutYhteisetTutkinnonOsat.map(
            (to: any) => to.osaAlueet
          )
        )

        return [
          ...self.aiemminHankitutAmmatTutkinnonOsat,
          ...self.aiemminHankitutPaikallisetTutkinnonOsat,
          // treat osaAlue as tutkinnonOsa for aiemminHankitutYhteisetTutkinnonOsat
          ...osaAlueet
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
        const opiskeluOikeusDoesntHaveOsaamisala = () =>
          !(
            self.opiskeluOikeus.suoritukset &&
            self.opiskeluOikeus.suoritukset.length &&
            self.opiskeluOikeus.suoritukset[0].osaamisala.length
          )

        const getLatestOsaamisala = (osaamisalat: IOsaamisala[]) => {
          if (osaamisalat.length === 1) return osaamisalat[0]
          return maxBy(
            osaamisalat,
            (osaamisala: IOsaamisala) => osaamisala.alku
          )
        }

        if (opiskeluOikeusDoesntHaveOsaamisala()) return ""

        const latestOsaamisala = getLatestOsaamisala(
          self.opiskeluOikeus.suoritukset[0].osaamisala
        )

        return latestOsaamisala
          ? latestOsaamisala.osaamisala.nimi[root.translations.activeLocale]
          : ""
      },
      get tutkinnonNimi() {
        const isOsittainen = self.opiskeluOikeus.isOsittainen

        const translations = getRoot<IRootStore>(self).translations
        const messages = translations.messages[translations.activeLocale]
        const osittainenText: string = messages
          ? messages["opiskeluoikeus.osittainen"]
          : "osittainen"
        const tutkinnonNimi = self.opiskeluOikeus.suoritukset.length
          ? self.opiskeluOikeus.suoritukset[0].koulutusmoduuli.nimi
          : ""
        const osittainenResult = isOsittainen ? ", " + osittainenText : ""

        return tutkinnonNimi + osittainenResult
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
      },
      get isTuvaHoks() {
        return self.opiskeluOikeus.tyyppi.isTuvaOpiskeluoikeus
      }
    }
  })

export type IHOKS = Instance<typeof HOKS>
