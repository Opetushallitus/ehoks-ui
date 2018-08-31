import { when } from "mobx"
import { mockFetch } from "../../utils"
import { RootStore } from "../RootStore"

describe("Student info", () => {
  test("Fetching works", () => {
    const store = RootStore.create({}, { fetch: mockFetch() })

    expect(store.student.isLoading).toBe(false)
    expect(store.student.info).toEqual({
      basicInformation: { fi: "", sv: "" },
      hoksProcess: { fi: "", sv: "" }
    })

    store.student.fetchInfo()
    expect(store.student.isLoading).toBe(true)

    when(
      () => !store.student.isLoading,
      () => {
        expect(store.student.info).toEqual({
          basicInformation: { fi: "Perustietoa eHOKS-palvelusta", sv: "" },
          hoksProcess: { fi: "Perustietoa HOKS-prosessista", sv: "" }
        })
      }
    )
  })
})
