import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
import drop from "lodash.drop"
import take from "lodash.take"
import { flow, getEnv, types } from "mobx-state-tree"
import { MockStudent } from "mocks/MockStudent"
import { mockStudents } from "mocks/mockStudents"
import { StoreEnvironment } from "types/StoreEnvironment"

const sortKeys = [
  "id",
  "nimi",
  "tutkinto",
  "osaamisala",
  "hyvaksytty",
  "paivitetty",
  "lukumaara"
] as const

export type SearchSortKey = typeof sortKeys[number]

export const SearchResult = types.model("SearchResult", {
  id: types.number,
  nimi: types.string,
  tutkinto: types.string,
  osaamisala: types.string,
  hyvaksytty: types.string,
  paivitetty: types.string,
  lukumaara: types.number
})

const SortBy = types.enumeration("sortBy", [...sortKeys])

const Search = types
  .model("Search", {
    activePage: 0,
    approvedOnly: false,
    results: types.array(SearchResult),
    isLoading: false,
    sortBy: types.optional(SortBy, "nimi"),
    sortDirection: "asc",
    perPage: 10
  })
  .volatile(
    (_): { searchTexts: { [key in SearchSortKey]: string } } => {
      return {
        searchTexts: {
          id: "",
          nimi: "",
          tutkinto: "",
          osaamisala: "",
          hyvaksytty: "",
          paivitetty: "",
          lukumaara: ""
        }
      }
    }
  )
  .actions(self => {
    const { fetchSingle, apiUrl } = getEnv<StoreEnvironment>(self)

    const toggleApprovedOnly = () => {
      self.approvedOnly = !self.approvedOnly
    }

    const changeSearchText = (
      field: SearchSortKey,
      searchText: string = ""
    ) => {
      self.activePage = 0
      // create new object ref as volatile data is not mobx observable
      self.searchTexts = { ...self.searchTexts, [field]: searchText }
    }

    const fetchStudents = flow(function*() {
      self.isLoading = true

      // TODO: query params, paging
      const response = yield fetchSingle(apiUrl("hoksit"))
      self.results = response.data
      self.isLoading = false
    })

    // TODO: real implementation
    const mockFetchStudents = () => {
      self.isLoading = true
      const keysWithText = Object.keys(self.searchTexts).filter(
        (key: SearchSortKey) => self.searchTexts[key].length > 0
      )
      self.results.replace(
        keysWithText.length
          ? mockStudents.filter(student => {
              return keysWithText.every((key: SearchSortKey) => {
                if (key === "hyvaksytty" || key === "paivitetty") {
                  return !!format(parseISO(student[key]), "d.M.yyyy")
                    .toLowerCase()
                    .match(self.searchTexts[key].toLowerCase())
                } else {
                  return !!String(student[key])
                    .toLowerCase()
                    .match(self.searchTexts[key].toLowerCase())
                }
              })
            })
          : mockStudents
      )
      self.isLoading = false
    }

    const changeSort = (sortName: keyof MockStudent) => {
      const changeDirection = self.sortBy === sortName
      self.sortBy = sortName
      self.sortDirection = changeDirection
        ? self.sortDirection === "asc"
          ? "desc"
          : "asc"
        : self.sortDirection
    }

    const changeActivePage = (page: number) => {
      self.activePage = page
    }

    return {
      changeActivePage,
      changeSort,
      changeSearchText,
      fetchStudents,
      mockFetchStudents,
      toggleApprovedOnly
    }
  })
  .views(self => {
    return {
      // TODO: this should be handled in
      // the backend in the real implementation
      get sortedResults() {
        return take(
          drop(
            self.results.slice().sort((a, b) => {
              const reverse = self.sortDirection === "desc"
              if (a[self.sortBy] > b[self.sortBy]) {
                return reverse ? -1 : 1
              } else if (a[self.sortBy] < b[self.sortBy]) {
                return reverse ? 1 : -1
              } else {
                return 0
              }
            }),
            self.activePage * self.perPage
          ),
          self.perPage
        )
      },
      // TODO: real implementation
      // TODO: fetch using backend API for given oid(?)
      studentById(id: string) {
        const student = self.results.find(result => {
          return result.id.toString() === id
        })
        const [firstName, surname] = student
          ? student.nimi.split(" ")
          : ["Mock", "User"]
        return {
          firstName,
          surname,
          oid: id,
          commonName: firstName,
          contactValuesGroup: [] as any,
          yhteystiedot: {
            sahkoposti: "mock@user.dev",
            katuosoite: "Esimerkkikatu 123",
            postinumero: "12345",
            kunta: "Kunta",
            puhelinnumero: "000000000"
          }
        }
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
