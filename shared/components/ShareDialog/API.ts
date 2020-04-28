import { APIConfig } from "components/APIConfigContext"

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
  type: string,
  apiConfig: APIConfig
): Promise<ShareLink[]> {
  const { apiUrl, apiPrefix } = apiConfig
  const response = await window.fetch(
    apiUrl(`${apiPrefix}/hoksit/share/${moduleId}`),
    {
      credentials: "include"
    }
  )
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  const json: { data: BackendShareLink[] } = await response.json()
  return json.data
    .filter(link => link.tyyppi === type)
    .map(link => ({
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
  type,
  apiConfig
}: {
  startDate: string
  endDate: string
  moduleId: string
  type: string
  apiConfig: APIConfig
}): Promise<string> {
  const { apiUrl, apiPrefix } = apiConfig
  const response = await window.fetch(apiUrl(`${apiPrefix}/hoksit/share`), {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "voimassaolo-alku": startDate,
      "voimassaolo-loppu": endDate,
      tyyppi: type,
      "module-id": moduleId
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
    apiUrl(`${apiPrefix}/hoksit/share//${uuid}`),
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
