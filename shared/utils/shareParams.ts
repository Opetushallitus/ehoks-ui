import { WindowLocation } from "@reach/router"
import queryString from "query-string"
import { ShareType } from "stores/NotificationStore"

export function parseShareParams(
  location: WindowLocation | undefined
): {
  share: {
    type: ShareType
    moduleId: string | ""
    tutkinnonOsaTyyppi: string | ""
    tutkinnonOsaId: string | ""
  }
} {
  const qs = queryString.parse(location ? location.search : "")
  return {
    share: {
      type: "osaamisenosoittaminen", //TODO typeof qs.type === "string" ? qs.type : "",
      moduleId: typeof qs.moduleId === "string" ? qs.moduleId : "",
      tutkinnonOsaTyyppi:
        typeof qs.tutkinnonOsaTyyppi === "string" ? qs.tutkinnonOsaTyyppi : "",
      tutkinnonOsaId:
        typeof qs.tutkinnonOsaId === "string" ? qs.tutkinnonOsaId : ""
    }
  }
}

export const stringifyShareParams = ({
  type,
  moduleId,
  tutkinnonOsaTyyppi,
  tutkinnonOsaId
}: {
  type: ShareType
  moduleId: string
  tutkinnonOsaTyyppi: string
  tutkinnonOsaId: string
}): string =>
  queryString.stringify({ type, moduleId, tutkinnonOsaTyyppi, tutkinnonOsaId })
