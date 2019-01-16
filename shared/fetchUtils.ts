import "whatwg-fetch" // polyfill window.fetch for IE 11
import camelCase from "lodash.camelcase"
import mapObj from "map-obj"

function camelCaseDeep(model: any) {
  return mapObj(model, (key: string, value: any) => [camelCase(key), value], {
    deep: true
  })
}

export function fetchUtils(fetchImplementation: any) {
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

    // extra typings needed because of https://github.com/mobxjs/mobx-state-tree/issues/507
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

    // extra typings needed because of https://github.com/mobxjs/mobx-state-tree/issues/507
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
  url: string
) => {
  const [, path] = url.split(apiUrl(""))
  return Promise.resolve({
    json: () => {
      return import(`stores/mocks/${path.replace(
        /\/|\-/g,
        "_"
      )}${version}.json`)
      //return Promise.resolve(json)
    },
    ok: true,
    statusText: "Error"
  })
}

// fetch that includes credentials
export const fetch = (url: string | Request, init: RequestInit) =>
  window.fetch(url, { credentials: "include", ...init })
