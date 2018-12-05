import { getSnapshot } from "mobx-state-tree"
import { RootStore } from "../RootStore"

describe("RootStore", () => {
  test("constructor should produce valid tree even with empty input object", () => {
    const store = RootStore.create({}, {})
    expect(getSnapshot(store)).toEqual({
      education: {
        info: {
          basicInformation: { fi: "", sv: "" },
          hoksProcess: { fi: "", sv: "" }
        },
        isLoading: false
      },
      environment: {
        eperusteetPerusteUrl: "",
        error: "",
        isLoading: false,
        opintopolkuLoginUrl: "",
        opintopolkuLogoutUrl: ""
      },
      isLoading: false,
      oppilas: {
        isLoading: false,
        perusteet: []
      },
      session: {
        error: "",
        isLoading: false,
        user: null
      },
      translations: { activeLocale: "fi", isLoading: false, translations: [] },
      tyopaikanToimija: {
        oppijat: [],
        isLoading: false
      }
    })
  })
})
