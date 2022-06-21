import {
  Instance,
  flow,
  getEnv,
  getRoot,
  isAlive,
  types
} from "mobx-state-tree"
import { TyopaikkajaksoRaporttiRivi } from "models/TyopaikkajaksoRaporttiRivi"
import { IRootStore } from "stores/RootStore"
import { APIResponse } from "types/APIResponse"
import { StoreEnvironment } from "types/StoreEnvironment"

const RaportitStoreModel = {
  alku: types.optional(types.string, ""),
  loppu: types.optional(types.string, ""),
  descText: "",
  initSearchDone: false,
  loading: false,
  pageCount: 0,
  selected: 0,
  titleText: "Klikkaa valikosta haluamasi raportti",
  tyopaikkajaksoRivit: types.array(TyopaikkajaksoRaporttiRivi)
}

export const RaportitStore = types
  .model("RaportitStore", RaportitStoreModel)
  .actions(self => {
    const { apiUrl, appendCallerId, fetchSingle } = getEnv<StoreEnvironment>(
      self
    )
    const rootStore: IRootStore = getRoot<IRootStore>(self)
    const fetchTyopaikkajaksoRivit = flow(function*(
      pageSize: number,
      pageIndex: number
    ): any {
      const tutkinto = JSON.stringify({})
      // const { notifications } = rootStore! // TODO
      const oppilaitosOid = rootStore?.session.selectedOrganisationOid
      if (self.alku.length && self.loppu.length && oppilaitosOid) {
        self.loading = true
        const uri =
          "virkailija/tep-jakso-raportti?tutkinto=" +
          tutkinto +
          "&oppilaitos=" +
          oppilaitosOid +
          "&start=" +
          self.alku +
          "&end=" +
          self.loppu +
          "&pagesize=" +
          pageSize +
          "&pageindex=" +
          pageIndex
        const response: APIResponse = yield fetchSingle(apiUrl(uri), {
          headers: appendCallerId()
        })

        // TODO error states
        if (isAlive(self)) {
          console.log(response.data)
          self.tyopaikkajaksoRivit = response.data.result
          self.loading = false
          self.pageCount = response.data.pagecount
        }

        self.initSearchDone = true // TODO ???
      }
    })

    const setAlku = (alku: string) => (self.alku = alku)
    const setLoppu = (loppu: string) => (self.loppu = loppu)

    return { fetchTyopaikkajaksoRivit, setAlku, setLoppu }
  })
// TODO views? Actions?

export type IRaportitStore = Instance<typeof RaportitStore>
