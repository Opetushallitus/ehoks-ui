import "whatwg-fetch" // polyfill window.fetch for IE 11
import camelCase from "lodash.camelcase"
import mapObj from "map-obj"
import queryString from "query-string"
import { APIResponse } from "types/APIResponse"

const camelCaseDeep = (model: any) =>
  mapObj(model, (key: string, value: any) => [camelCase(key), value], {
    deep: true
  })

export const withQueryString = (url: string, queryParams: any) =>
  `${url}?${queryString.stringify(queryParams)}`

export function fetchUtils(
  fetchImplementation: WindowOrWorkerGlobalScope["fetch"]
) {
  async function getCollection<D = any, M = any>(
    url: string,
    isPrimitiveCollection: boolean,
    init?: RequestInit
  ): Promise<APIResponse<D, M>> {
    const response = await fetchImplementation(url, init)
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    const json = await response.json()

    const data = json.data ? json.data : []

    return {
      data: isPrimitiveCollection ? data : data.map(camelCaseDeep),
      meta: json.meta || {}
    }
  }

  const fetchPrimitiveCollection = async <D = any, M = any>(
    url: string,
    init?: RequestInit
  ): Promise<APIResponse<D, M>> => getCollection(url, true, init)

  const fetchCollection = async <D = any, M = any>(
    url: string,
    init?: RequestInit
  ): Promise<APIResponse<D, M>> => getCollection(url, false, init)

  return {
    fetchSingle: async (url: string, init?: RequestInit) => {
      const { method = "GET" } = init ? init : {}
      const response = await fetchImplementation(url, init)

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      if (method === "GET") {
        const json = await response.json()
        const model = {
          // supports:
          // 1) array with one object in json.data
          // 2) object in json.data
          data: Array.isArray(json.data) ? json.data[0] : json.data,
          meta: json.meta || {}
        }
        // camelCase kebab-cased object keys recursively so we can use dot syntax for accessing values
        return camelCaseDeep(model)
      } else {
        return response
      }
    },

    fetchCollection,
    fetchPrimitiveCollection,

    fetch: async (url: string, init?: RequestInit) => {
      const response = await fetchImplementation(url, init)
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const json = await response.json()
      return json
    },

    deleteResource: async (url: string, init?: RequestInit) => {
      const response = await fetchImplementation(url, {
        ...init,
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      return response.ok
    },

    patchResource: async (url: string, init?: RequestInit) => {
      const response = await fetchImplementation(url, {
        ...init,
        method: "PATCH"
      })

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      return response
    }
  }
}

/** mocked fetch using local JSON files
 * stores/mocks/[path_with_underscores][version number or 0].json
 */
export const mockFetch = (apiUrl: (path: string) => string, version = 0) => (
  url: string
): Promise<Response> => {
  const path = url.replace(apiUrl(""), "")
  const mockResponse = {
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    formData: () => Promise.resolve(new FormData()),
    text: () => Promise.resolve(""),
    blob: () => Promise.resolve(new Blob()),
    headers: new Headers(),
    redirected: false,
    status: 200,
    url: path,
    trailer: Promise.resolve(new Headers()),
    type: "basic" as ResponseType,
    body: null,
    bodyUsed: false,
    clone: () => mockResponse,
    json: () =>
      import(`stores/mocks/${path.replace(/\/|-/g, "_")}${version}.json`),
    ok: true,
    statusText: "Error"
  }
  return Promise.resolve(mockResponse)
}

// fetch that includes credentials
export const fetch = (url: string | Request, init: RequestInit) =>
  window.fetch(url, { credentials: "include", ...init })

export const appendCommonHeaders = (headers?: Headers) => {
  function getCSRF() {
    const val = document.cookie.match("(^|;)\\s*CSRF\\s*=\\s*([^;]+)")
    return val ? val.pop() : ""
  }
  const CSRF_VALUE = "" + getCSRF()

  const resultHeaders = headers ? headers : new Headers()
  resultHeaders.append("Caller-Id", "1.2.246.562.10.00000000001.ehoks.ehoks-ui")
  if (CSRF_VALUE !== "") {
    resultHeaders.append("CSRF", CSRF_VALUE)
  }
  return resultHeaders
}
