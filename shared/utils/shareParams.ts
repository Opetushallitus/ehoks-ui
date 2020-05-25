import { WindowLocation } from "@reach/router"
import queryString from "query-string"
import { ShareType, TutkinnonOsaType } from "../models/helpers/ShareTypes"

export function parseShareParams(
  location: WindowLocation | undefined
): {
  share: {
    type?: ShareType
    moduleId: string | ""
    tutkinnonOsaTyyppi?: TutkinnonOsaType
    tutkinnonOsaId: string | ""
  }
} {
  const qs = queryString.parse(location ? location.search : "")
  return {
    share: {
      type:
        ShareType[qs.type as ShareType] != null
          ? ShareType[qs.type as ShareType]
          : undefined,
      moduleId: typeof qs.moduleId === "string" ? qs.moduleId : "",
      tutkinnonOsaTyyppi: qs.tutkinnonOsaTyyppi as TutkinnonOsaType,
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
  type: string
  moduleId: string
  tutkinnonOsaTyyppi: TutkinnonOsaType
  tutkinnonOsaId: string
}): string =>
  queryString.stringify({ type, moduleId, tutkinnonOsaTyyppi, tutkinnonOsaId })
