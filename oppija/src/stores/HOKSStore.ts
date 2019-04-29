import { flow, getEnv, types } from "mobx-state-tree"
import { HOKS } from "models/HOKS"
import { StoreEnvironment } from "types/StoreEnvironment"

const HOKSStoreModel = {
  isLoading: false,
  suunnitelmat: types.array(HOKS)
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

    return { haeSuunnitelmat }
  })
