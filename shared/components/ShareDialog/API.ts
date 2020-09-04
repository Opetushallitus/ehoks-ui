import { APIConfig } from "components/APIConfigContext"
import { TutkinnonOsaType } from "../../models/helpers/ShareTypes"
import { getEnv } from "mobx-state-tree"
import { StoreEnvironment } from "types/StoreEnvironment"
import {
  IOsaamisenHankkimistapa,
  IOsaamisenOsoittaminen
} from "models/helpers/TutkinnonOsa"

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

interface BackendLinkInfo {
  "oppija-nimi": string
  "oppija-oid": string
  "tutkinto-nimi": string
  "osaamisala-nimi": string
  "voimassaolo-alku": string
  "voimassaolo-loppu": string
  "osaamisen-osoittaminen"?: IOsaamisenOsoittaminen[]
  "osaamisen-hankkimistapa"?: IOsaamisenHankkimistapa[]
  "tutkinnonosa-tyyppi": string
}

export interface LinkInfo {
  oppijaNimi: string
  oppijaOid: string
  tutkintoNimi: string
  osaamisalaNimi: string
  voimassaoloAlku: string
  voimassaoloLoppu: string
  osaamisenOsoittaminen?: IOsaamisenOsoittaminen[]
  osaamisenHankkimistapa?: IOsaamisenHankkimistapa[]
  tutkinnonosaTyyppi: string
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

export const fetchLink = async function(
  uuid: string,
  apiConfig: APIConfig
): Promise<LinkInfo> {
  const { apiUrl, apiPrefix } = apiConfig
  const { fetchSingle } = getEnv<StoreEnvironment>(self)

  const response = fetchSingle(apiUrl(`${apiPrefix}/jaot/jakolinkit/${uuid}`), {
    credentials: "include"
  })
  return response

  // const json: { BackendLinkInfo } = await response
  // return {
  //   oppijaNimi: json.data["oppija-nimi"],
  //   oppijaOid: json.data["oppija-oid"],
  //   tutkintoNimi: json.data["tutkinto-nimi"],
  //   osaamisalaNimi: json.data["osaamisala-nimi"],
  //   voimassaoloAlku: json.data["voimassaolo-alku"],
  //   voimassaoloLoppu: json.data["voimassaolo-loppu"],
  //   osaamisenOsoittaminen: json.data["osaamisen-osoittaminen"],
  //   osaamisenHankkimistapa: json.data["osaamisen-hankkimistapa"],
  //   tutkinnonosaTyyppi: json.data["tutkinnonosa-tyyppi"]
  // }
}
