import { WindowLocation } from "@reach/router"
import queryString from "query-string"

export function parseShareParams(
  location: WindowLocation | undefined
): {
  share:
  {
    koodiUri: string
    type: string
    uuid: string
  }
} {
  const qs = queryString.parse(location ? location.search : "")
  return {
    share:
    {
      koodiUri: typeof qs.koodiUri === "string" ? qs.koodiUri : "",
      type: typeof qs.type === "string" ? qs.type : "",
      uuid: typeof qs.uuid === "string" ? qs.uuid : ""
    }
  }
}

export function stringifyShareParams({
  type,
  uuid,
  koodiUri
}: {
  type: string,
  uuid: string,
  koodiUri: string
}): string {
  return queryString.stringify({ type, uuid, koodiUri })
}
queryString.stringify
