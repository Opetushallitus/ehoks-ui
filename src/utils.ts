import { apiUrl } from "config"
import { Instance } from "mobx-state-tree"
import { EnvironmentStore } from "stores/EnvironmentStore"
import { InjectedStores, RootStore } from "stores/RootStore"
import { TranslationStore } from "stores/TranslationStore"
import "whatwg-fetch" // polyfill window.fetch for IE 11

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

export const getTranslations = (
  root: Instance<typeof RootStore>
): Instance<typeof TranslationStore> => {
  return root.translations
}

export const getEnvironment = (
  root: Instance<typeof RootStore>
): Instance<typeof EnvironmentStore> => {
  return root.environment
}
