import drop from "lodash.drop"
import take from "lodash.take"
import { types } from "mobx-state-tree"
import { MockStudent } from "mocks/MockStudent"
import { mockStudents } from "mocks/mockStudents"
// import { IStoreEnvironment } from "utils"

export const SearchResult = types.model("SearchResult", {
  id: types.number,
  nimi: types.string,
  tutkinto: types.string,
  osaamisala: types.string,
  hyvaksytty: types.string,
  paivitetty: types.string,
  lukumaara: types.number
})

const Search = types
  .model("Search", {
    activePage: 0,
    approvedOnly: false,
    searchText: "",
    results: types.array(SearchResult),
    isLoading: false,
    sortBy: types.optional(
      types.enumeration("sortBy", [
        "id",
        "nimi",
        "tutkinto",
        "osaamisala",
        "hyvaksytty",
        "paivitetty",
        "lukumaara"
      ]),
      "nimi"
    ),
    sortDirection: "desc",
    perPage: 10
  })
  .actions(self => {
    // const { fetchSingle } = getEnv<IStoreEnvironment>(self)

    const toggleApprovedOnly = () => {
      self.approvedOnly = !self.approvedOnly
    }

    const changeSearchText = (searchText: string = "") => {
      self.activePage = 0
      self.searchText = searchText
    }

    // TODO: real implementation
    const fetchStudents = () => {
      self.isLoading = true
      self.results.replace(
        self.searchText.length > 0
          ? mockStudents.filter(student => {
              return !!student.nimi.toLowerCase().match(self.searchText)
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
      toggleApprovedOnly
    }
  })
  .views(self => {
    return {
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
