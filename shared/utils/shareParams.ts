import { WindowLocation } from "@reach/router"
import queryString from "query-string"
import { ShareType } from "stores/NotificationStore"

export function parseShareParams(
  location: WindowLocation | undefined
): {
  share: string
  type: ShareType | ""
  uuid: string
} {
  const qs = queryString.parse(location ? location.search : "")
  return {
    share: typeof qs.share === "string" ? qs.share : "",
    type:
      typeof qs.type === "string" &&
        (qs.type === "naytto" || qs.type === "tyossaoppiminen")
        ? qs.type
        : "",
    uuid: typeof qs.uuid === "string" ? qs.uuid : ""
  }
}

export function stringifyShareParams({
  share,
  type,
  uuid
}: {
  share: string
  type: ShareType
  uuid: string
}): string {
  return queryString.stringify({ share, type, uuid })
}
queryString.stringify
