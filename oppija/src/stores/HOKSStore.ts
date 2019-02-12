// import { apiUrl } from "config"
import { flow, Instance, types } from "mobx-state-tree"
import { suunnitelmat } from "mocks/mockSuunnitelmat"
import { Suunnitelma } from "models/Suunnitelma"
// import { StoreEnvironment } from "types/StoreEnvironment"

const mockFetchHOKS = (eid: string) => {
  const suunnitelma = suunnitelmat.find(s => s.eid === eid)
  return Promise.resolve({
    data: {
      eid,
      ...suunnitelma
    }
  })
}

const mockFetchSuunnitelmat = () => {
  return new Promise(resolve => {
    window.setTimeout(() => {
      resolve({ data: [{ eid: "1" }, { eid: "2" }, { eid: "3" }] })
    }, 500)
  })
}

const HOKSStoreModel = {
  isLoading: false,
  suunnitelmat: types.optional(types.array(Suunnitelma), []),
  suunnitelma: types.optional(Suunnitelma, {}) // TODO: used only for KoulutuksenJarjestaja views, remove later
}

export const HOKSStore = types
  .model("HOKSStore", HOKSStoreModel)
  .actions(self => {
    // const { fetchCollection, errors } = getEnv<StoreEnvironment>(self)

    const haeHOKS = flow(function*(eid: string) {
      const response = yield mockFetchHOKS(eid)
      return response.data
    })

    const haeSuunnitelmat = flow(function*() {
      self.isLoading = true
      const response = yield mockFetchSuunnitelmat()
      self.suunnitelmat = yield Promise.all(
        response.data.map((suunnitelma: Instance<typeof Suunnitelma>) => {
          return haeHOKS(suunnitelma.eid)
        })
      )
      self.isLoading = false
      // try {
      //   const response = yield fetchCollection(apiUrl(`hoks`))
      //   self.suunnitelmat = response.data
      //   self.isLoading = false
      // } catch (error) {
      //   errors.logError("HOKSStore.haeSuunnitelmat", error.message)
      //   self.isLoading = false
      // }
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
