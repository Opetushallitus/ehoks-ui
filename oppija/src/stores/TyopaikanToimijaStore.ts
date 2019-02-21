// import { apiUrl } from "config"
import { getEnv, types } from "mobx-state-tree"
import { oppijat } from "mocks/mockOppijat"
import { Oppija } from "models/Oppija"
import { StoreEnvironment } from "types/StoreEnvironment"

const TyopaikanToimijaModel = {
  oppijat: types.array(Oppija),
  isLoading: false
}

export const TyopaikanToimijaStore = types
  .model("TyopaikanToimijaStore", TyopaikanToimijaModel)
  .actions(self => {
    const { errors } = getEnv<StoreEnvironment>(self)

    // const haeOppijat = flow(function*() {
    const haeOppijat = () => {
      self.isLoading = true
      try {
        // TODO: replace with real API call
        // const response = yield root.fetchCollection(apiUrl("oppijat"))
        // self.oppijat.replace(response.data)
        self.oppijat.replace(oppijat as any)
      } catch (error) {
        errors.logError("TyopaikanToimijaStore.haeOppijat", error.message)
      }
    }

    return { haeOppijat }
  })
