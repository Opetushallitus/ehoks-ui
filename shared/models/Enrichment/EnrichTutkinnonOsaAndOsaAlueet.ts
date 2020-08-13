import { flow, getEnv, Instance, types } from "mobx-state-tree"
import { StoreEnvironment } from "types/StoreEnvironment"
import { APIResponse } from "types/APIResponse"
import { YhteisenTutkinnonOsanOsaAlue } from "../YhteinenTutkinnonOsa/YhteisenTutkinnonOsanOsaAlue"
import { OsaAlueVastaus } from "../YhteinenTutkinnonOsa/OsaAlueVastaus"

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
      callerId
    } = getEnv<StoreEnvironment>(self)

    const getTutkinnonOsaFromEPerusteet = (code: string) =>
      fetchSingle(apiUrl(`${apiPrefix}/external/eperusteet/${code}`), {
        headers: callerId()
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
        self.tutkinnonOsa = response.data
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
          headers: callerId()
        }
      )

    const fetchOsaAlue = flow(function*(tutkinnonOsaId: number): any {
      try {
        cachedOsaAlueResponses[tutkinnonOsaId] =
          cachedOsaAlueResponses[tutkinnonOsaId] ||
          getOsaAlueetFromEPerusteet(tutkinnonOsaId)

        const { data }: APIResponse = yield cachedOsaAlueResponses[
          tutkinnonOsaId
        ]
        self.osaAlueet.forEach(function(
          osaAlue: Instance<typeof YhteisenTutkinnonOsanOsaAlue>
        ) {
          osaAlue.osaAlue = data.find(
            (x: Instance<typeof OsaAlueVastaus>) =>
              x.koodiUri === osaAlue.osaAlueKoodiUri
          )
        })
      } catch (error) {
        errors.logError(
          "EnrichOsaAlue.fetchOsaAlueFromEPerusteet",
          error.message
        )
      }
    })

    const fetchKAIKKITODORENAME = flow(function*(
      tutkinnonOsaKoodiUri: string
    ): any {
      yield fetchTutkinnonOsa(tutkinnonOsaKoodiUri)
      yield fetchOsaAlue(self.tutkinnonOsa.id)
    })

    const afterCreate = () => {
      fetchKAIKKITODORENAME(self.tutkinnonOsaKoodiUri)
    }

    return { afterCreate }
  })
