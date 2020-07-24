// import { flow, getEnv, types } from "mobx-state-tree"
// import { StoreEnvironment } from "types/StoreEnvironment"
// import { APIResponse } from "types/APIResponse"
//
// interface DynamicObject {
//   [name: string]: any
// }
//
// // dumb cache for preventing multiple fetches for the same koodi-uri's
// const cachedResponses: DynamicObject = {}
//
// export const EnrichTutkinnonOsaAndOsaAlue = types
//   .model({})
//   // we need this typing to avoid 'missing index signature' error
//   // when assigning to self[dynamicKey]
//   .volatile((): DynamicObject => ({}))
//   .actions(self => {
//     const { apiUrl, apiPrefix, errors, fetchSingle, callerId } = getEnv<
//       StoreEnvironment
//     >(self)
//
//     const getTutkinnonOsaFromEPerusteet = (code: string) =>
//       fetchSingle(apiUrl(`${apiPrefix}/external/eperusteet/${code}`), {
//         headers: callerId()
//       })
//
//     const fetchTutkinnonOsa = flow(function*(koodiUri: string): any {
//       try {
//         // check our global cache first
//         cachedResponses[koodiUri] =
//           cachedResponses[koodiUri] || getTutkinnonOsaFromEPerusteet(koodiUri)
//         const response: APIResponse = yield cachedResponses[koodiUri]
//         self.tutkinnonOsa = response.data
//       } catch (error) {
//         errors.logError("EnrichKoodiUri.fetchEPerusteet", error.message)
//       }
//     })
//
//     const getOsaAlueetFromEPerusteet = (tutkinnonOsaId: number) =>
//       fetchSingle(
//         apiUrl(
//           `${apiPrefix}/external/eperusteet/tutkinnonosat/${tutkinnonOsaId}/osaalueet`
//         ),
//         {
//           headers: callerId()
//         }
//       )
//
//     const fetchOsaAlue = flow(function*(): any {
//       try {
//         const { data }: APIResponse = yield getOsaAlueetFromEPerusteet(
//           self.tutkinnonOsa.id
//         )
//       } catch (error) {
//         errors.logError("EnrichOsaAlue.fetchFromEPerusteet", error.message)
//       }
//     })
//
//     const fetchKAIKKITODORENAME = flow(function*(
//       tutkinnonOsaKoodiUri: string
//     ): any {
//       yield fetchTutkinnonOsa(tutkinnonOsaKoodiUri)
//       // yield fetchOsaAlue()
//     })
//
//     const afterCreate = () => {
//       fetchKAIKKITODORENAME(self.tutkinnonOsaKoodiUri)
//     }
//
//     return { afterCreate }
//   })
