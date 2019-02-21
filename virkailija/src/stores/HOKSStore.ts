import { flow, types } from "mobx-state-tree"
import { suunnitelmat } from "mocks/mockSuunnitelmat"
import { Suunnitelma } from "models/Suunnitelma"

const mockFetchHOKS = (eid: string) => {
  return Promise.resolve({
    eid,
    ...suunnitelmat[0]
  })
}

const HOKSStoreModel = {
  isLoading: false,
  suunnitelma: types.optional(Suunnitelma, {})
}

export const HOKSStore = types
  .model("HOKSStore", HOKSStoreModel)
  .actions(self => {
    // const { fetchCollection, errors } = getEnv<StoreEnvironment>(self)

    const haeSuunnitelma = flow(function*(eid: string) {
      self.isLoading = true
      self.suunnitelma = yield mockFetchHOKS(eid)
      self.isLoading = false
    })

    return { haeSuunnitelma }
  })
