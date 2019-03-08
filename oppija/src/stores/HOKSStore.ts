import { flow, getEnv, types } from "mobx-state-tree"
import { suunnitelmat } from "mocks/mockSuunnitelmat"
import { HOKS } from "models/HOKS"
import { StoreEnvironment } from "types/StoreEnvironment"

const mockFetchHOKS = (eid: string) => {
  const suunnitelma = suunnitelmat.find(s => s.eid === eid)
  return Promise.resolve({
    data: {
      eid,
      ...suunnitelma
    }
  })
}

const HOKSStoreModel = {
  isLoading: false,
  suunnitelmat: types.array(HOKS),
  suunnitelma: types.optional(HOKS, {}) // TODO: used only for KoulutuksenJarjestaja views, remove later
}

export const HOKSStore = types
  .model("HOKSStore", HOKSStoreModel)
  .actions(self => {
    const { apiUrl, fetchCollection, errors } = getEnv<StoreEnvironment>(self)

    const haeSuunnitelmat = flow(function*(oid: string) {
      self.isLoading = true
      try {
        const response = yield fetchCollection(
          apiUrl(`oppija/oppijat/${oid}/hoks`)
        )
        self.suunnitelmat = response.data
        self.isLoading = false
      } catch (error) {
        errors.logError("HOKSStore.haeSuunnitelmat", error.message)
        self.isLoading = false
      }
    })

    // TODO: remove this when KoulutuksenJarjestaja is fully testable in virkailija app
    const haeSuunnitelma = flow(function*(_: string) {
      self.isLoading = true
      const response = yield mockFetchHOKS("1") // always fetch the first mock
      self.suunnitelma = response.data
      self.isLoading = false
    })

    return { haeSuunnitelmat, haeSuunnitelma }
  })
