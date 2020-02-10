import { APIConfig } from "components/APIConfigContext"

interface BackendShareLink {
  "jako-uuid": string
  uuid: string
  "alku": string
  "loppu": string
  tyyppi: string
}

export interface ShareLink {
  uuid: string
  validFrom: string
  validTo: string
  tyyppi: string
}

export const fetchLinks = async function (
  apiConfig: APIConfig,
  uuid: string
): Promise<ShareLink[]> {
  const { apiUrl, apiPrefix } = apiConfig
  const response = await window.fetch(
    apiUrl(`${apiPrefix}/hoksit/share/${uuid}`),
    {
      credentials: "include"
    }
  )
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  const jsondata: BackendShareLink[] = await response.json()
  return jsondata
    .filter((link: any) => {
      return link.uuid === uuid
    })
    .map((link: any) => {
      return {
        "jako-uuid": link["jako-uuid"],
        uuid: link.uuid,
        validFrom: link["alku"],
        validTo: link["loppu"],
        tyyppi: link.tyyppi
      }
    })
}

export const createLink = async function ({
  eid,
  startDate,
  endDate,
  uuid,
  tutkinnonOsaTyyppi,
  apiConfig
}: {
  eid: string
  startDate: string
  endDate: string
  uuid: string,
  tutkinnonOsaTyyppi: string,
  apiConfig: APIConfig
}): Promise<string> {
  const { apiUrl, apiPrefix } = apiConfig
  const response = await window.fetch(
    apiUrl(`${apiPrefix}/hoksit/share/${eid}`),
    {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "voimassaolo-alku": startDate,
        "voimassaolo-loppu": endDate,
        "tyyppi": tutkinnonOsaTyyppi,
        "uuid": uuid
      })
    }
  )

  if (!response.ok) {
    throw new Error(response.statusText)
  }
  const json = await response.json()
  return json["jako-uuid"]
}

export const removeLink = async function ({
  eid,
  koodiUri,
  uuid,
  apiConfig
}: {
  eid: string
  koodiUri: string
  uuid: String
  apiConfig: APIConfig
}) {
  const { apiUrl, apiPrefix } = apiConfig
  const response = await window.fetch(
    apiUrl(`${apiPrefix}/hoksit/${eid}/share/${koodiUri}/${uuid}`),
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
