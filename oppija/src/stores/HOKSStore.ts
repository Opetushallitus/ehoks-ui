import { flow, getEnv, types } from "mobx-state-tree"
import { HOKS } from "models/HOKS"
import { APIResponse } from "types/APIResponse"
import { StoreEnvironment } from "types/StoreEnvironment"

const HOKSStoreModel = {
  isLoading: false,
  suunnitelmat: types.array(HOKS)
}

export const HOKSStore = types
  .model("HOKSStore", HOKSStoreModel)
  .actions(self => {
    const { apiUrl, fetchCollection, errors } = getEnv<StoreEnvironment>(self)

    const haeSuunnitelmat = flow(function*(oid: string): any {
      self.isLoading = true
      try {
        const response: APIResponse = yield fetchCollection(
          apiUrl(`oppija/oppijat/${oid}/hoks`)
        )
        self.suunnitelmat = response.data
        yield Promise.all(
          self.suunnitelmat.map(suunnitelma => {
            return suunnitelma.fetchOpiskeluoikeudet()
          })
        )
        self.isLoading = false
      } catch (error) {
        errors.logError("HOKSStore.haeSuunnitelmat", error.message)
        self.isLoading = false
      }
    })

    return { haeSuunnitelmat }
  })
