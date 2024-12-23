import queryString from "query-string"
import { ShareType, TutkinnonOsaType } from "../models/helpers/ShareTypes"

export function parseShareParams(search: string | undefined): {
  share: {
    type?: ShareType
    moduleId: string | ""
    tutkinnonOsaTyyppi?: TutkinnonOsaType
    tutkinnonOsaModuleId: string | ""
    hoksEid: string | ""
  }
} {
  const qs = queryString.parse(search ?? "")
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
          : "",
      hoksEid: typeof qs.hoksEid === "string" ? qs.hoksEid : ""
    }
  }
}

export const stringifyShareParams = ({
  type,
  moduleId,
  tutkinnonOsaTyyppi,
  tutkinnonOsaModuleId,
  hoksEid
}: {
  type: string
  moduleId: string
  tutkinnonOsaTyyppi: TutkinnonOsaType
  tutkinnonOsaModuleId: string
  hoksEid: string
}): string =>
  queryString.stringify({
    type,
    moduleId,
    tutkinnonOsaTyyppi,
    tutkinnonOsaModuleId,
    hoksEid
  })

export const parseLinkUuid = (
  location: Location | undefined
): {
  link: {
    uuid: string | undefined
  }
} => ({
  link: {
    uuid: location?.pathname ? location.pathname.split("/").pop() : ""
  }
})
