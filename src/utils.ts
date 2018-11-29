import { apiUrl } from "config"
import camelCase from "lodash.camelcase"
import mapObj from "map-obj"
import { IEnvironmentStore } from "stores/EnvironmentStore"
import { InjectedStores, IRootStore } from "stores/RootStore"
import { ITranslationStore } from "stores/TranslationStore"
import "whatwg-fetch" // polyfill window.fetch for IE 11

function camelCaseDeep(model: any) {
  return mapObj(model, (key: string, value: any) => [camelCase(key), value], {
    deep: true
  })
}

// mocked fetch using local json files
export const mockFetch = (version = 0) => (url: string) => {
  const [, path] = url.split(apiUrl(""))
  return Promise.resolve({
    json: () => {
      const json = require("./stores/mocks/" +
        path.replace(/\/|\-/g, "_") +
        version +
        ".json")
      return Promise.resolve(json)
    },
    ok: true,
    statusText: "Error"
  })
}

// fetch that includes credentials
export const fetch = (url: string | Request, init: RequestInit) =>
  window.fetch(url, { credentials: "include", ...init })

export const injectSession = (stores: InjectedStores) => ({
  session: stores.store.session
})

export const getTranslations = (root: IRootStore): ITranslationStore => {
  return root.translations
}

export const getEnvironment = (root: IRootStore): IEnvironmentStore => {
  return root.environment
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

export type IStoreEnvironment = ReturnType<typeof fetchUtils>
