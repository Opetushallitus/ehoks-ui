import { Instance, types } from "mobx-state-tree"

export const ShareLink = types.model("ShareLink", {
  id: types.number,
  createdAt: types.string,
  validFrom: types.string,
  validTo: types.string,
  url: types.string
})

export type IShareLink = Instance<typeof ShareLink>

export const ShareLinkStore = types.model("ShareLinkStore", {}).actions(() => {
  // const { fetchCollection, errors, callerId } = getEnv<StoreEnvironment>(self)

  //const fetchLinks = flow(koodiUri: string, type: string) {
  const fetchLinks = function(koodiUri: string, type: string) {
    console.log("fetching share links for", koodiUri, type)

    // TODO: mock data, replace with real API call
    return Promise.resolve([
      {
        id: 1,
        createdAt: "2019-05-01",
        validFrom: "2019-06-01",
        validTo: "2019-06-30",
        url: "https://ehoks.dev/share/1"
      },
      {
        id: 2,
        createdAt: "2019-05-02",
        validFrom: "2019-07-01",
        validTo: "2019-07-08",
        url: "https://ehoks.dev/share/2"
      },
      {
        id: 3,
        createdAt: "2019-05-03",
        validFrom: "2019-09-01",
        validTo: "2019-09-30",
        url: "https://ehoks.dev/share/3"
      }
    ]) as Promise<Instance<typeof ShareLink>[]>
    // try {
    //   const response = yield fetchCollection(apiUrl("shareLinks"),{ headers: callerId() })
    //   return response.data
    // } catch (error) {
    //   errors.logError("ShareLinkStore.fetchLinks", error.message)
    // }
  }

  return { fetchLinks }
})

export type IShareLinkStore = Instance<typeof ShareLinkStore>
