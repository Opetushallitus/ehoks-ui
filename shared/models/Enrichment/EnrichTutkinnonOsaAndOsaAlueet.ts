import { flow, getEnv, types } from "mobx-state-tree"
import { StoreEnvironment } from "types/StoreEnvironment"
import { APIResponse } from "types/APIResponse"
import { IOsaAlueVastaus } from "../YhteinenTutkinnonOsa/OsaAlueVastaus"

interface DynamicObject {
  [name: string]: any
}

// dumb cache for preventing multiple fetches for the same koodi-uri's
const cachedTutkinnonOsaResponses: DynamicObject = {}
const cachedOsaAlueResponses: DynamicObject = {}

export const EnrichTutkinnonOsaAndOsaAlueet = types
  .model({})
  // we need this typing to avoid 'missing index signature' error
  // when assigning to self[dynamicKey]
  .volatile((): DynamicObject => ({}))
  .actions(self => {
    const {
      apiUrl,
      apiPrefix,
      errors,
      fetchSingle,
      fetchCollection,
      appendCallerId
    } = getEnv<StoreEnvironment>(self)

    const getTutkinnonOsaFromEPerusteet = (code: string) =>
      fetchSingle(apiUrl(`${apiPrefix}/external/eperusteet/${code}`), {
        headers: appendCallerId()
      })

    const fetchTutkinnonOsa = flow(function*(koodiUri: string): any {
      try {
        // check our global cache first
        cachedTutkinnonOsaResponses[koodiUri] =
          cachedTutkinnonOsaResponses[koodiUri] ||
          getTutkinnonOsaFromEPerusteet(koodiUri)
        const response: APIResponse = yield cachedTutkinnonOsaResponses[
          koodiUri
        ]
        self.tutkinnonOsaId = response.data?.id
        if (!self.tutkinnonOsaId) {
          errors.logError(
            "EnrichKoodiUri.fetchEPerusteet",
            "Tutkinnon osaa ei saatu ladattua"
          )
        }
      } catch (error) {
        errors.logError("EnrichKoodiUri.fetchEPerusteet", error.message)
      }
    })

    const getOsaAlueetFromEPerusteet = (tutkinnonOsaId: number) =>
      fetchCollection(
        apiUrl(
          `${apiPrefix}/external/eperusteet/tutkinnonosat/${tutkinnonOsaId}/osaalueet`
        ),
        {
          headers: appendCallerId()
        }
      )

    const findMatchingOsaAlueFromEperusteetResponse = (
      ePerusteeReponse: any,
      osaAlueKoodiUri: string
    ) =>
      ePerusteeReponse.find(
        (osaAlueFromEperusteet: IOsaAlueVastaus) =>
          osaAlueFromEperusteet.koodiUri === osaAlueKoodiUri
      )

    const getEnrichedDataForOsaAlue = (ePerusteeReponse: any) => (osaAlue: {
      osaAlueEnrichedData: IOsaAlueVastaus
      osaAlueKoodiUri: string
    }) => {
      osaAlue.osaAlueEnrichedData = findMatchingOsaAlueFromEperusteetResponse(
        ePerusteeReponse,
        osaAlue.osaAlueKoodiUri
      )
    }

    const fetchOsaAlue = flow(function*(tutkinnonOsaId: number): any {
      try {
        cachedOsaAlueResponses[tutkinnonOsaId] =
          cachedOsaAlueResponses[tutkinnonOsaId] ||
          getOsaAlueetFromEPerusteet(tutkinnonOsaId)

        const { data }: APIResponse = yield cachedOsaAlueResponses[
          tutkinnonOsaId
        ]

        self.osaAlueet.forEach(getEnrichedDataForOsaAlue(data))
      } catch (error) {
        errors.logError("EnrichOsaAlue.fetchFromEPerusteet", error.message)
      }
    })

    const fetchTutkinnonOsaAndOsaAlueet = flow(function*(
      tutkinnonOsaKoodiUri: string
    ): any {
      yield fetchTutkinnonOsa(tutkinnonOsaKoodiUri)
      if (self.tutkinnonOsaId) {
        yield fetchOsaAlue(self.tutkinnonOsaId)
      }
    })

    const afterCreate = () => {
      fetchTutkinnonOsaAndOsaAlueet(self.tutkinnonOsaKoodiUri)
    }

    return { afterCreate }
  })
