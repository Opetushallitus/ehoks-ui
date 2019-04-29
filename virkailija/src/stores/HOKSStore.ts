import { flow, types } from "mobx-state-tree"
import { suunnitelmat } from "mocks/mockSuunnitelmat"
import { HOKS } from "models/HOKS"

const mockFetchHOKS = (_: string) => {
  // randomize 1-3 HOKSes for every student
  const amount = Math.floor(Math.random() * suunnitelmat.length) + 1
  return Promise.resolve(suunnitelmat.slice(0, amount))
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
