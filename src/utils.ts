import { apiUrl } from "config"
import { InjectedStores } from "stores/RootStore"

// mocked fetch using local json files
export const mockFetch = (version = 0) => (url: string) => {
  const [, path] = url.split(apiUrl(""))
  return Promise.resolve(
    require("./stores/mocks/" + path.replace(/\//g, "_") + version + ".json")
  )
}

// fetch that returns the JSON directly
export const fetch = (url: string | Request, init: RequestInit) =>
  window
    .fetch(url, { credentials: "include", ...init })
    .then(response => response.json())

export const injectSession = (stores: InjectedStores) => ({
  session: stores.store.session
})

export enum breakpoints {
  Tablet = 720,
  Desktop = 900
}
