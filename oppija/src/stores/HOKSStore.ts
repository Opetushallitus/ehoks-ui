// import { apiUrl } from "config"
import { flow, Instance, types } from "mobx-state-tree"
import { Suunnitelma } from "models/Suunnitelma"
// import { StoreEnvironment } from "types/StoreEnvironment"

const suunnitelmatMock: { [eid: string]: any } = {
  "1": {
    eid: "1",
    tutkinnonNimi: "Sosiaali- ja terveysalan perustutkinto",
    oppilaitos: "Opinpaikka",
    aloitusPvm: "2018-08-15"
  },
  "2": {
    eid: "2",
    tutkinnonNimi: "Asiakaskokemuksen kehittäminen ja palvelumuotoilu",
    oppilaitos: "Keuda",
    aloitusPvm: "2018-08-01"
  },
  "3": {
    eid: "3",
    tutkinnonNimi: "Media-alan ammattitutkinto",
    oppilaitos: "Keuda",
    keskeytysPvm: "2017-01-12"
  }
}

const mockFetchHOKS = (eid: string) => {
  return Promise.resolve({
    data: {
      eid,
      ...suunnitelmatMock[eid]
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
  suunnitelmat: types.optional(types.array(Suunnitelma), [])
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

    return { haeSuunnitelmat }
  })
