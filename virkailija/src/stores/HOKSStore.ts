import { flow, types } from "mobx-state-tree"
import { suunnitelmat } from "mocks/mockSuunnitelmat"
import { HOKS } from "models/HOKS"

const mockFetchHOKS = (_: string) => {
  // we only need the first HOKS mock here
  return Promise.resolve([suunnitelmat[0]])
}

const HOKSStoreModel = {
  isLoading: false,
  suunnitelmat: types.array(HOKS)
}

export const HOKSStore = types
  .model("HOKSStore", HOKSStoreModel)
  .actions(self => {
    // const { fetchCollection, errors } = getEnv<StoreEnvironment>(self)

    // fetch HOKSes using student oid
    const haeSuunnitelmat = flow(function*(oid: string) {
      self.isLoading = true
      self.suunnitelmat = yield mockFetchHOKS(oid)
      self.isLoading = false
    })

    return { haeSuunnitelmat }
  })
