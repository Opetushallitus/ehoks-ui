import { withQueryString } from "fetchUtils"
import max from "lodash.max"
import min from "lodash.min"
import { flow, getEnv, getRoot, Instance, types } from "mobx-state-tree"
import { HOKS } from "models/HOKS"
import { SessionUser } from "models/SessionUser"
import { IRootStore } from "stores/RootStore"
import { StoreEnvironment } from "types/StoreEnvironment"

const sortKeys = ["nimi", "tutkinto", "osaamisala"] as const

export type SearchSortKey = typeof sortKeys[number]

export const Oppija = types
  .model("Oppija", {
    oid: types.string,
    nimi: types.string,
    tutkinto: types.string,
    osaamisala: types.string,
    suunnitelmat: types.array(HOKS),
    henkilotiedot: types.optional(SessionUser, { commonName: "", surname: "" })
  })
  .actions(self => {
    const { fetchCollection, fetchSingle, apiUrl } = getEnv<StoreEnvironment>(
      self
    )

    const haeSuunnitelmat = flow(function*() {
      const response = yield fetchCollection(
        apiUrl(`virkailija/oppijat/${self.oid}/hoksit`)
      )
      self.suunnitelmat = response.data
    })

    const haeHenkilotiedot = flow(function*() {
      const response = yield fetchSingle(
        apiUrl(`virkailija/oppijat/${self.oid}`)
      )
      self.henkilotiedot = response.data
    })

    return { haeSuunnitelmat, haeHenkilotiedot }
  })
  .actions(self => {
    const afterCreate = () => {
      self.haeSuunnitelmat()
      self.haeHenkilotiedot()
    }
    return { afterCreate }
  })
  .views(self => ({
    get hyvaksytty() {
      return self.suunnitelmat.length
        ? min(self.suunnitelmat.map(s => s.ensikertainenHyvaksyminen))
        : null
    },
    get paivitetty() {
      return self.suunnitelmat.length
        ? max(self.suunnitelmat.map(s => s.paivitetty))
        : null
    },
    get lukumaara() {
      return self.suunnitelmat.length
    }
  }))

export interface IOppija extends Instance<typeof Oppija> {}

const SortBy = types.enumeration("sortBy", [...sortKeys])

const Search = types
  .model("Search", {
    activePage: 0,
    totalResultsCount: 0,
    results: types.array(Oppija),
    isLoading: false,
    sortBy: types.optional(SortBy, "nimi"),
    sortDirection: "asc",
    perPage: 10
  })
  .volatile(
    (_): { searchTexts: { [key in SearchSortKey]: string } } => {
      return {
        searchTexts: {
          nimi: "",
          tutkinto: "",
          osaamisala: ""
        }
      }
    }
  )
  .actions(self => {
    const { fetchCollection, apiUrl } = getEnv<StoreEnvironment>(self)

    const haeOppijat = flow(function*() {
      // TODO fix cross reference of stores?
      const rootStore: IRootStore = getRoot<IRootStore>(self)
      const oppilaitosOid: string = rootStore.session.selectedOrganisationOid
      if (oppilaitosOid === "") {
        return
      }

      self.isLoading = true

      const queryParams = {
        "order-by": self.sortBy,
        desc: self.sortDirection === "desc",
        "item-count": self.perPage,
        page: self.activePage,
        "oppilaitos-oid": oppilaitosOid
      }

      const textQueries = Object.keys(self.searchTexts).reduce<{
        [key: string]: string
      }>((texts, key: "nimi" | "tutkinto" | "osaamisala") => {
        if (self.searchTexts[key].length) {
          texts[key] = self.searchTexts[key]
        }
        return texts
      }, {})

      const response = yield fetchCollection(
        withQueryString(apiUrl("virkailija/oppijat"), {
          ...queryParams,
          ...textQueries
        })
      )
      self.results = response.data
      if (response.meta["total-count"]) {
        self.totalResultsCount = response.meta["total-count"]
      }
      self.isLoading = false
    })

    return { haeOppijat }
  })
  .actions(self => {
    const changeSearchText = (
      field: SearchSortKey,
      searchText: string = ""
    ) => {
      self.activePage = 0
      // create new object ref as volatile data is not mobx observable
      self.searchTexts = { ...self.searchTexts, [field]: searchText }
    }

    const changeSort = (sortName: "nimi" | "tutkinto" | "osaamisala") => {
      const changeDirection = self.sortBy === sortName
      self.sortBy = sortName
      self.sortDirection = changeDirection
        ? self.sortDirection === "asc"
          ? "desc"
          : "asc"
        : self.sortDirection
      self.haeOppijat()
    }

    const changeActivePage = (page: number) => {
      self.activePage = page
      self.haeOppijat()
    }

    return {
      changeActivePage,
      changeSort,
      changeSearchText
    }
  })
  .views(self => {
    return {
      oppija(oid: string) {
        return self.results.find(result => {
          return result.oid === oid
        })
      }
    }
  })

const KoulutuksenJarjestajaModel = {
  search: types.optional(Search, {})
}

export const KoulutuksenJarjestajaStore = types.model(
  "KoulutuksenJarjestajaStore",
  KoulutuksenJarjestajaModel
)
