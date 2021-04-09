import { APIConfig } from "components/APIConfigContext"
import { TutkinnonOsaType } from "../../models/helpers/ShareTypes"
import { appendCommonHeaders } from "../../fetchUtils"

interface BackendShareLink {
  "share-id": string
  "module-id": string
  "voimassaolo-alku": string
  "voimassaolo-loppu": string
  tyyppi: string
}

export interface ShareLink {
  jakoUuid: string
  validFrom: string
  validTo: string
  type: string
}
export const fetchLinks = async function(
  moduleId: string,
  apiConfig: APIConfig
): Promise<ShareLink[]> {
  const { apiUrl, apiPrefix } = apiConfig
  const response = await window.fetch(
    apiUrl(`${apiPrefix}/jaot/moduulit/${moduleId}`),
    {
      headers: appendCommonHeaders(),
      credentials: "include"
    }
  )
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  const json: { data: BackendShareLink[] } = await response.json()
  return json.data.map(link => ({
    jakoUuid: link["share-id"],
    validFrom: link["voimassaolo-alku"],
    validTo: link["voimassaolo-loppu"],
    type: link.tyyppi
  }))
}

export const createLink = async function({
  startDate,
  endDate,
  moduleId,
  hoksEid,
  type,
  tutkinnonOsaTyyppi,
  tutkinnonOsaModuleId,
  apiConfig
}: {
  startDate: string
  endDate: string
  moduleId: string
  hoksEid: string
  type: string
  tutkinnonOsaTyyppi: TutkinnonOsaType
  tutkinnonOsaModuleId: string
  apiConfig: APIConfig
}): Promise<string> {
  const { apiUrl, apiPrefix } = apiConfig
  const response = await window.fetch(apiUrl(`${apiPrefix}/jaot/jakolinkit`), {
    credentials: "include",
    method: "POST",
    headers: appendCommonHeaders(
      new Headers({
        "Content-Type": "application/json"
      })
    ),
    body: JSON.stringify({
      "tutkinnonosa-module-uuid": tutkinnonOsaModuleId,
      "tutkinnonosa-tyyppi": tutkinnonOsaTyyppi,
      "shared-module-uuid": moduleId,
      "shared-module-tyyppi": type,
      "voimassaolo-alku": startDate,
      "voimassaolo-loppu": endDate,
      "hoks-eid": hoksEid
    })
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }
  const json = await response.json()
  return json.meta.uuid
}

export const removeLink = async function({
  uuid,
  apiConfig
}: {
  uuid: string
  apiConfig: APIConfig
}) {
  const { apiUrl, apiPrefix } = apiConfig
  const response = await window.fetch(
    apiUrl(`${apiPrefix}/jaot/jakolinkit/${uuid}`),
    {
      credentials: "include",
      method: "DELETE",
      headers: appendCommonHeaders(
        new Headers({
          "Content-Type": "application/json"
        })
      )
    }
  )

  if (!response.ok) {
    throw new Error(response.statusText)
  }
}
