import { RootStore } from "../RootStore"

describe("RootStore", () => {
  test("constructor should produce valid tree even with empty input object", () => {
    const store = RootStore.create({}, {})
    // for some reason store.toJSON can be undefined, ensure that it exists first
    expect(typeof store.toJSON === "function" && store.toJSON()).toEqual({
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
