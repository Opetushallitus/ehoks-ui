import { APIConfig } from "components/APIConfigContext"
import { TutkinnonOsaType } from "../../models/helpers/ShareTypes"

interface BackendShareLink {
  "jako-uuid": string
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
      credentials: "include"
    }
  )
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  const json: { data: BackendShareLink[] } = await response.json()
  return json.data.map(link => ({
    jakoUuid: link["jako-uuid"],
    validFrom: link["voimassaolo-alku"],
    validTo: link["voimassaolo-loppu"],
    type: link.tyyppi,
    moduleId: link["module-id"]
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
    headers: {
      "Content-Type": "application/json"
    },
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
      headers: {
        "Content-Type": "application/json"
      }
    }
  )

  if (!response.ok) {
    throw new Error(response.statusText)
  }
}
