import { withQueryString } from "fetchUtils"
import max from "lodash.max"
import min from "lodash.min"
import {
  flow,
  getEnv,
  getRoot,
  Instance,
  isAlive,
  types
} from "mobx-state-tree"
import { HOKS } from "models/HOKS"
import { SessionUser } from "models/SessionUser"
import { IRootStore } from "stores/RootStore"
import { APIResponse } from "types/APIResponse"
import { StoreEnvironment } from "types/StoreEnvironment"

const sortKeys = ["nimi", "tutkinto", "osaamisala"] as const

export type SearchSortKey = typeof sortKeys[number]

export const Translation = types.model("Translation", {
  fi: types.optional(types.string, ""),
  sv: types.optional(types.string, "")
})

export const Oppija = types
  .model("Oppija", {
    oid: types.string,
    nimi: types.string,
    tutkinto: types.string,
    osaamisala: types.string,
    opiskeluoikeusOid: types.string,
    // tutkintoNimi: Translation,
    // osaamisalaNimi: Translation,
    suunnitelmat: types.array(HOKS),
    suunnitelmaIndex: types.optional(types.integer, -1),
    henkilotiedot: types.optional(SessionUser, { commonName: "", surname: "" })
  })
  .actions(self => {
    const { fetchCollection, fetchSingle, apiUrl, callerId } = getEnv<
      StoreEnvironment
    >(self)

    // fetches HOKSes with basic info (root level only)
    const fetchSuunnitelmat = flow(function*(): any {
      const response: APIResponse = yield fetchCollection(
        apiUrl(`virkailija/oppijat/${self.oid}/hoksit`),
        { headers: callerId() }
      )

      // This node might get detached (destroyed) if user navigates
      // to another view during async operation, as fetchOppijat
      // overwrites previous students. We should only
      // set plans when node is still attached (alive)
      // TODO: reimplement when MST flow cancellation PR (#691) gets merged
      if (isAlive(self)) {
        self.suunnitelmat = response.data
        self.suunnitelmaIndex = self.suunnitelmat.findIndex(
          s => s.opiskeluoikeusOid === self.opiskeluoikeusOid
        )
      }
    })

    const fetchHenkilotiedot = flow(function*(): any {
      const response: APIResponse = yield fetchSingle(
        apiUrl(`virkailija/oppijat/${self.oid}`),
        { headers: callerId() }
      )
      const { oid, nimi } = response.data
      // This node might get detached (destroyed) if user navigates
      // to another view during async operation, as fetchOppijat
      // overwrites previous students. We should only
      // set personal info when node is still attached (alive)
      // TODO: reimplement when MST flow cancellation PR (#691) gets merged
      if (isAlive(self) && isAlive(self.henkilotiedot)) {
        self.henkilotiedot.oid = oid
        self.henkilotiedot.fullName = nimi
      }
    })

    const fetchOpiskeluoikeudet = flow(function*(): any {
      return Promise.all(
        self.suunnitelmat.map(suunnitelma => {
          return suunnitelma.fetchOpiskeluoikeudet()
        })
      )
    })

    return { fetchSuunnitelmat, fetchHenkilotiedot, fetchOpiskeluoikeudet }
  })
  .views(self => ({
    get hyvaksytty() {
      return self.suunnitelmaIndex > -1
        ? self.suunnitelmat[self.suunnitelmaIndex].ensikertainenHyvaksyminen
        : null
    },
    get paivitetty() {
      return self.suunnitelmaIndex > -1
        ? self.suunnitelmat[self.suunnitelmaIndex].paivitetty
        : null
    },
    get lukumaara() {
      return self.suunnitelmat.length
    },
    get editLink(): string {
      const manualPlans = self.suunnitelmat.filter(suunnitelma => {
        return suunnitelma.manuaalisyotto
      })
      return manualPlans.length
        ? manualPlans.length > 1
          ? `/ehoks-virkailija-ui/koulutuksenjarjestaja/${self.oid}`
          : `/ehoks-virkailija-ui/hoks/${self.oid}/${manualPlans[0].id}`
        : ""
    }
    // get tutkinto(): string {
    //   const activeLocale: Locale = getRoot<IRootStore>(self).translations
    //     .activeLocale
    //   switch (activeLocale) {
    //     case Locale.FI:
    //       return self.tutkintoNimi.fi
    //     case Locale.SV:
    //       return self.tutkintoNimi.sv
    //   }
    // },
    // get osaamisala(): string {
    //   const activeLocale: Locale = getRoot<IRootStore>(self).translations
    //     .activeLocale
    //   switch (activeLocale) {
    //     case Locale.FI:
    //       return self.osaamisalaNimi.fi
    //     case Locale.SV:
    //       return self.osaamisalaNimi.sv
    //   }
    // }
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
    const { fetchCollection, apiUrl, callerId } = getEnv<StoreEnvironment>(self)

    const fetchOppijat = flow(function*(): any {
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

      const response: APIResponse = yield fetchCollection(
        withQueryString(apiUrl("virkailija/oppijat"), {
          ...queryParams,
          ...textQueries
        }),
        { headers: callerId() }
      )
      self.results.clear()
      self.results = response.data
      if (response.meta["total-count"]) {
        self.totalResultsCount = response.meta["total-count"]
      }

      // side effects, fetch plans & personal info for all students
      yield Promise.all(
        self.results.map(
          flow(function*(oppija): any {
            yield oppija.fetchSuunnitelmat()
            yield oppija.fetchHenkilotiedot()
          })
        )
      )

      self.isLoading = false
    })

    return { fetchOppijat }
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
      self.fetchOppijat()
    }

    const changeActivePage = (page: number) => {
      self.activePage = page
      self.fetchOppijat()
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
