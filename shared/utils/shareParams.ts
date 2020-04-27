import { WindowLocation } from "@reach/router"
import queryString from "query-string"
import { ShareType } from "stores/NotificationStore"

export function parseShareParams(
  location: WindowLocation | undefined
): {
  share: { type: ShareType; moduleId: string | "" }
} {
  const qs = queryString.parse(location ? location.search : "")
  return {
    share: {
      type: "osaamisenosoittaminen", //TODO typeof qs.type === "string" ? qs.type : "",
      moduleId: typeof qs.moduleId === "string" ? qs.moduleId : ""
    }
  }
}

export const stringifyShareParams = ({
  type,
  moduleId
}: {
  type: ShareType
  moduleId: string
}): string => queryString.stringify({ type, moduleId })
