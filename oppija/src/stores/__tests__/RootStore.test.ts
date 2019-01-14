import { getSnapshot } from "mobx-state-tree"
import { RootStore } from "../RootStore"

describe("RootStore", () => {
  test("constructor should produce valid tree even with empty input object", () => {
    const store = RootStore.create({}, {})
    expect(getSnapshot(store)).toMatchSnapshot()
  })
})
