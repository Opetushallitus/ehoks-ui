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
    tutkinnonOsaModuleId: string | ""
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
      tutkinnonOsaModuleId:
        typeof qs.tutkinnonOsaModuleId === "string"
          ? qs.tutkinnonOsaModuleId
          : ""
    }
  }
}

export const stringifyShareParams = ({
  type,
  moduleId,
  tutkinnonOsaTyyppi,
  tutkinnonOsaModuleId
}: {
  type: string
  moduleId: string
  tutkinnonOsaTyyppi: TutkinnonOsaType
  tutkinnonOsaModuleId: string
}): string =>
  queryString.stringify({
    type,
    moduleId,
    tutkinnonOsaTyyppi,
    tutkinnonOsaModuleId
  })
