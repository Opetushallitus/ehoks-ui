import { withQueryString } from "fetchUtils"
import {
  flow,
  getEnv,
  getRoot,
  Instance,
  isAlive,
  types
} from "mobx-state-tree"
import find from "lodash.find"
// import get from "lodash.get"
import { HOKS } from "models/HOKS"
import { SessionUser } from "models/SessionUser"
import { IRootStore } from "stores/RootStore"
import { Locale } from "stores/TranslationStore"
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
    tutkintoNimi: types.optional(Translation, {}),
    osaamisalaNimi: types.optional(Translation, {}),
    opiskeluoikeusOid: types.string,
    suunnitelmat: types.array(HOKS),
    suunnitelmaIndex: types.optional(types.integer, -1),
    henkilotiedot: types.optional(SessionUser, { surname: "" })
  })
  .actions(self => {
    const { fetchCollection, fetchSingle, apiUrl, appendCallerId } = getEnv<
      StoreEnvironment
    >(self)

    // fetches HOKSes with basic info (root level only)
    const rootStore: IRootStore = getRoot<IRootStore>(self)
    const oppilaitosOid: string = rootStore.session.selectedOrganisationOid
    const fetchSuunnitelmat = flow(function*(): any {
      const response: APIResponse = yield fetchCollection(
        apiUrl(
          `virkailija/oppijat/${self.oid}/hoksit/oppilaitos/${oppilaitosOid}`
        ),
        { headers: appendCallerId() }
      )

      // NOTE: This node might get detached (destroyed) if user navigates
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
        { headers: appendCallerId() }
      )
      const { oid, nimi } = response.data
      // NOTE: This node might get detached (destroyed) if user navigates
      // to another view during async operation, as fetchOppijat
      // overwrites previous students. We should only
      // set personal info when node is still attached (alive)
      // TODO: reimplement when MST flow cancellation PR (#691) gets merged
      if (isAlive(self) && isAlive(self.henkilotiedot)) {
        self.henkilotiedot.oid = oid
        self.henkilotiedot.fullName = nimi
      }
    })

    // eslint-disable-next-line require-yield
    const fetchOpiskeluoikeudet = flow(function*(): any {
      return Promise.all(
        self.suunnitelmat.map(suunnitelma =>
          suunnitelma.fetchOpiskeluoikeudet()
        )
      )
    })

    return { fetchSuunnitelmat, fetchHenkilotiedot, fetchOpiskeluoikeudet }
  })
  .views(self => ({
    get hyvaksytty() {
      return self.suunnitelmaIndex > -1
        ? self.suunnitelmat[self.suunnitelmaIndex].ensikertainenHyvaksyminen
        : undefined
    },
    get paivitetty() {
      return self.suunnitelmaIndex > -1
        ? self.suunnitelmat[self.suunnitelmaIndex].paivitetty
        : undefined
    },
    get lukumaara() {
      return self.suunnitelmat.length
    },
    get editLink(): string {
      const manualPlans = self.suunnitelmat.filter(
        suunnitelma => suunnitelma.manuaalisyotto
      )
      return manualPlans.length
        ? manualPlans.length > 1
          ? `/ehoks-virkailija-ui/koulutuksenjarjestaja/${self.oid}`
          : `/ehoks-virkailija-ui/hoks/${self.oid}/${manualPlans[0].id}`
        : ""
    },
    get tutkinto(): string {
      const translations = getRoot<IRootStore>(self).translations
      const activeLocale: Locale = translations.activeLocale
      const osittainenText =
        translations.messages[activeLocale]["opiskeluoikeus.osittainen"] ||
        "osittainen"
      const isOsittainen = self.suunnitelmat.some(
        s =>
          s.opiskeluOikeus.oid === self.opiskeluoikeusOid &&
          s.opiskeluOikeus.isOsittainen
      )

      self.suunnitelmat.map(s => {
        if (
          s.opiskeluOikeus.oid === "" &&
          s.opiskeluoikeusOid === self.opiskeluoikeusOid
        ) {
          s.fetchOpiskeluoikeudet()
        }
      })
      const x = find(
        self.suunnitelmat,
        y => y.opiskeluoikeusOid === self.opiskeluoikeusOid
      )
      //console.log(get(x, "opiskeluoikeus.suoritukset[0].tutkinnonNimi"))
      console.log(x?.tutkinnonNimi)
      const osittainenResult = isOsittainen ? ", " + osittainenText : ""
      switch (activeLocale) {
        case Locale.FI:
          return self.tutkintoNimi.fi + osittainenResult
        case Locale.SV:
          return self.tutkintoNimi.sv + osittainenResult
        default:
          return ""
      }
    },
    get osaamisala(): string {
      const activeLocale: Locale = getRoot<IRootStore>(self).translations
        .activeLocale
      switch (activeLocale) {
        case Locale.FI:
          return self.osaamisalaNimi.fi
        case Locale.SV:
          return self.osaamisalaNimi.sv
        default:
          return ""
      }
    }
  }))

export type IOppija = Instance<typeof Oppija>

const SortBy = types.enumeration("sortBy", [...sortKeys])

const Search = types
  .model("Search", {
    activePage: 0,
    totalResultsCount: 0,
    results: types.array(Oppija),
    isLoading: false,
    sortBy: types.optional(SortBy, "nimi"),
    sortDirection: "asc",
    perPage: 10,
    fromListView: true
  })
  .volatile((): { searchTexts: { [key in SearchSortKey]: string } } => ({
    searchTexts: {
      nimi: "",
      tutkinto: "",
      osaamisala: ""
    }
  }))
  .actions(self => {
    const { fetchCollection, fetchSingle, apiUrl, appendCallerId } = getEnv<
      StoreEnvironment
    >(self)

    const fetchOppijat = flow(function*(): any {
      // TODO fix cross reference of stores?
      const rootStore: IRootStore = getRoot<IRootStore>(self)
      const oppilaitosOid: string = rootStore.session.selectedOrganisationOid
      if (oppilaitosOid === "") {
        return
      }
      const activeLocale: Locale = getRoot<IRootStore>(self).translations
        .activeLocale

      self.isLoading = true

      const queryParams = {
        "order-by-column": self.sortBy,
        desc: self.sortDirection === "desc",
        "item-count": self.perPage,
        page: self.activePage,
        "oppilaitos-oid": oppilaitosOid,
        locale: activeLocale
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
        { headers: appendCallerId() }
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
      self.fromListView = true
      self.isLoading = false
    })

    // Fetches oppija by id and adds it to results
    const fetchOppija = flow(function*(oppijaOid): any {
      const response: APIResponse = yield fetchSingle(
        apiUrl(`virkailija/oppijat/${oppijaOid}/with-oo`),
        { headers: appendCallerId() }
      )
      self.results.clear()
      self.results.push(response.data)
      yield Promise.all(
        self.results.map(
          flow(function*(oppija): any {
            yield oppija.fetchSuunnitelmat()
            yield oppija.fetchHenkilotiedot()
          })
        )
      )
      self.fromListView = false
    })

    const resetActivePage = () => {
      self.activePage = 0
    }

    const setFromListView = (val: boolean) => {
      self.fromListView = val
    }

    return { fetchOppijat, fetchOppija, resetActivePage, setFromListView }
  })
  .actions(self => {
    const changeSearchText = (field: SearchSortKey, searchText = "") => {
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
  .views(self => ({
    oppija: (oid: string) => self.results.find(result => result.oid === oid)
  }))

const KoulutuksenJarjestajaModel = {
  search: types.optional(Search, {})
}

export const KoulutuksenJarjestajaStore = types.model(
  "KoulutuksenJarjestajaStore",
  KoulutuksenJarjestajaModel
)
