// import { apiUrl } from "config"
import { types } from "mobx-state-tree"
import { Oppija } from "models/Oppija"

const TyopaikanToimijaModel = {
  oppijat: types.array(Oppija),
  isLoading: false
}

export const TyopaikanToimijaStore = types.model(
  "TyopaikanToimijaStore",
  TyopaikanToimijaModel
)
// .actions(self => {
//   const root = getRoot<IRootStore>(self)
//   return { }
// })
