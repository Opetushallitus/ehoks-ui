import { flow, getEnv, types } from "mobx-state-tree"
import { StoreEnvironment } from "types/StoreEnvironment"
import { APIResponse } from "types/APIResponse"
import { IOsaAlueVastaus } from "../YhteinenTutkinnonOsa/OsaAlueVastaus"

interface DynamicObject {
  [name: string]: any
}

// dumb cache for preventing multiple fetches for the same koodi-uri's
const cachedTutkinnonOsaResponses: DynamicObject = {}

export const EnrichTutkinnonOsaAndOsaAlueet = types
  .model({})
  // we need this typing to avoid 'missing index signature' error
  // when assigning to self[dynamicKey]
  .volatile((): DynamicObject => ({}))
  .actions(self => {
    const { apiUrl, apiPrefix, errors, fetchSingle, appendCallerId } =
      getEnv<StoreEnvironment>(self)

    const getTutkinnonOsaFromEPerusteet = (code: string) =>
      fetchSingle(apiUrl(`${apiPrefix}/external/eperusteet/${code}`), {
        headers: appendCallerId()
      })

    const findMatchingOsaAlueFromEperusteetResponse = (
      osaAlueetVastaus: any,
      osaAlueKoodiUri: string
    ) => {
      const osaAlueVastaus = osaAlueetVastaus.find(
        (osaAlueFromEperusteet: IOsaAlueVastaus) =>
          osaAlueFromEperusteet.koodiUri === osaAlueKoodiUri ||
          (osaAlueKoodiUri.startsWith("ammatillisenoppiaineet_vvai") &&
            osaAlueFromEperusteet.koodiUri === "ammatillisenoppiaineet_vvai22")
      )
      if (!osaAlueVastaus) {
        errors.logError("EnrichOsaAlue.fetchFromEPerusteet", osaAlueKoodiUri)
      }
      return osaAlueVastaus || { koodiUri: osaAlueKoodiUri }
    }

    const getEnrichedDataForOsaAlue =
      (osaAlueet: any) =>
      (osaAlue: {
        osaAlueEnrichedData: IOsaAlueVastaus
        osaAlueKoodiUri: string
      }) => {
        osaAlue.osaAlueEnrichedData = findMatchingOsaAlueFromEperusteetResponse(
          osaAlueet,
          osaAlue.osaAlueKoodiUri
        )
      }

    const fetchTutkinnonOsa = flow(function* (koodiUri: string): any {
      try {
        // check our global cache first
        cachedTutkinnonOsaResponses[koodiUri] =
          cachedTutkinnonOsaResponses[koodiUri] ||
          getTutkinnonOsaFromEPerusteet(koodiUri)
        const response: APIResponse =
          yield cachedTutkinnonOsaResponses[koodiUri]
        self.tutkinnonOsaId = response.data?.id
        if (!self.tutkinnonOsaId) {
          errors.logError(
            "EnrichKoodiUri.fetchEPerusteet",
            "Tutkinnon osaa ei saatu ladattua"
          )
        }
        self.osaAlueet.forEach(
          getEnrichedDataForOsaAlue(response.data?.osaAlueet)
        )
      } catch (error) {
        errors.logError("EnrichKoodiUri.fetchEPerusteet", error.message)
      }
    })

    const afterCreate = () => {
      fetchTutkinnonOsa(self.tutkinnonOsaKoodiUri)
    }

    return { afterCreate }
  })
