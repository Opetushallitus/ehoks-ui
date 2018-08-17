import { when } from "mobx"
import { mockFetch } from "../../utils"
import { RootStore } from "../RootStore"

describe("Learning periods", () => {
  test("Fetching works", () => {
    const store = RootStore.create({}, { fetch: mockFetch })

    expect(store.isLoading).toBe(false)
    expect(store.learningPeriods).toEqual([])

    store.fetchLearningPeriods()
    expect(store.isLoading).toBe(true)

    when(
      () => !store.isLoading,
      () => {
        expect(store.learningPeriods.length).toBe(2)
      }
    )
  })
})
