import { flow, types } from "mobx-state-tree"
import { suunnitelmat } from "mocks/mockSuunnitelmat"
import { HOKS } from "models/HOKS"

const mockFetchHOKS = (eid: string) => {
  return Promise.resolve([
    {
      eid,
      ...suunnitelmat[0]
    }
  ])
}

const HOKSStoreModel = {
  isLoading: false,
  suunnitelmat: types.array(HOKS)
}

export const HOKSStore = types
  .model("HOKSStore", HOKSStoreModel)
  .actions(self => {
    // const { fetchCollection, errors } = getEnv<StoreEnvironment>(self)

    const haeSuunnitelmat = flow(function*(eid: string) {
      self.isLoading = true
      self.suunnitelmat = yield mockFetchHOKS(eid)
      self.isLoading = false
    })

    return { haeSuunnitelmat }
  })
