import "whatwg-fetch" // polyfill window.fetch for IE 11
import camelCase from "lodash.camelcase"
import mapObj from "map-obj"

function camelCaseDeep(model: any) {
  return mapObj(model, (key: string, value: any) => [camelCase(key), value], {
    deep: true
  })
}

export function fetchUtils(fetchImplementation: GlobalFetch["fetch"]) {
  return {
    fetchSingle: async (url: string, init?: RequestInit) => {
      const response = await fetchImplementation(url, init)
      if (!response.ok) {
        throw new Error(response.statusText)
      }
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
    },

    fetchCollection: async (url: string, init?: RequestInit) => {
      const response = await fetchImplementation(url, init)
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const json = await response.json()
      const model = {
        data: (json.data ? json.data : []).map(camelCaseDeep),
        meta: json.meta || {}
      }
      return model
    },

    deleteResource: async (url: string, init?: RequestInit) => {
      const response = await fetchImplementation(url, {
        ...init,
        method: "DELETE"
      })
      return response.ok
    }
  }
}

// mocked fetch using local json files
export const mockFetch = (apiUrl: (path: string) => string, version = 0) => (
  url: string,
  _init?: RequestInit
): Promise<Response> => {
  const [, path] = url.split(apiUrl(""))
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
    json: () => {
      return import(`stores/mocks/${path.replace(
        /\/|\-/g,
        "_"
      )}${version}.json`)
    },
    ok: true,
    statusText: "Error"
  }
  return Promise.resolve(mockResponse)
}

// fetch that includes credentials
export const fetch = (url: string | Request, init: RequestInit) =>
  window.fetch(url, { credentials: "include", ...init })
