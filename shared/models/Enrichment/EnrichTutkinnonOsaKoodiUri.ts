import { flow, getEnv, types } from "mobx-state-tree"
import { StoreEnvironment } from "types/StoreEnvironment"
import { APIResponse } from "types/APIResponse"
import { TutkinnonOsaType } from "../helpers/ShareTypes"

interface DynamicObject {
  [name: string]: any
}

// dumb cache for preventing multiple fetches for the same koodi-uri's
const cachedResponses: DynamicObject = {}

export const EnrichTutkinnonOsaKoodiUri = types
  .model({})
  // we need this typing to avoid 'missing index signature' error
  // when assigning to self[dynamicKey]
  .volatile((): DynamicObject => ({}))
  .actions(self => {
    const { apiUrl, apiPrefix, errors, fetchSingle, appendCallerId } = getEnv<
      StoreEnvironment
    >(self)

    const getFromEPerusteetService = (code: string) => {
      if (self.tyyppi === TutkinnonOsaType.HankittavaKoulutuksenOsa) {
        console.log("koulutuksenOsa Enrich")
        return fetchSingle(
          apiUrl(`${apiPrefix}/external/eperusteet/koulutuksenOsa/${code}`),
          {
            headers: appendCallerId()
          }
        )
      } else {
        return fetchSingle(apiUrl(`${apiPrefix}/external/eperusteet/${code}`), {
          headers: appendCallerId()
        })
      }
    }

    const fetchEPerusteet = flow(function*(koodiUri: string): any {
      try {
        // check our global cache first
        cachedResponses[koodiUri] =
          cachedResponses[koodiUri] || getFromEPerusteetService(koodiUri)
        const response: APIResponse = yield cachedResponses[koodiUri]
        self.tutkinnonOsa = response.data
      } catch (error) {
        errors.logError("EnrichKoodiUri.fetchEPerusteet", error.message)
        self.tutkinnonOsa = "n/a"
      }
    })

    const afterCreate = () => {
      const koodiUri =
        self.tyyppi === TutkinnonOsaType.HankittavaKoulutuksenOsa
          ? self.koulutuksenOsaKoodiUri
          : self.tutkinnonOsaKoodiUri
      fetchEPerusteet(koodiUri)
    }

    return { afterCreate }
  })
