import { apiUrl } from "config"
import { mockFetch } from "../../utils"
import { ApiResponse, RootStore } from "../RootStore"

describe("RootStore", () => {
  test("constructor should produce valid tree even with empty input object", () => {
    const store = RootStore.create({}, { fetch: mockFetch() })

    expect(store.toJSON()).toEqual({
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
      errors: {
        errors: []
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
      work: {
        info: {
          basicInformation: { fi: "", sv: "" },
          hoksProcess: { fi: "", sv: "" }
        },
        isLoading: false
      }
    })
  })

  test("fetchSingle camelCases object keys", async () => {
    // uses session_opintopolku_1.json mock
    const store = RootStore.create({}, { fetch: mockFetch(1) })

    const result: ApiResponse<any> = await store.fetchSingle(apiUrl("session"))
    expect(result).toEqual({
      data: {
        commonName: "Teuvo",
        firstName: "Teuvo Taavetti",
        surname: "Testaaja"
      },
      meta: {
        opintopolkuLoginUrl: "http://localhost:3000/auth-dev/opintopolku-login/"
      }
    })
  })

  test("fetchCollection camelCases object keys", async () => {
    // uses lokalisointi0.json mock
    const store = RootStore.create({}, { fetch: mockFetch() })

    const result: ApiResponse<any> = await store.fetchCollection(
      apiUrl("lokalisointi")
    )
    expect(result).toEqual({
      data: [
        {
          category: "ehoks",
          createdBy: "1.2.246.562.24.31103582397",
          key: "testiavain",
          locale: "fi",
          modifiedBy: "1.2.246.562.24.31103582397",
          value: "joo"
        },
        {
          category: "ehoks",
          createdBy: "1.2.246.562.24.43953048723",
          key: "toinentesti",
          locale: "fi",
          modifiedBy: "1.2.246.562.24.43953048723",
          value: "Upeeta"
        }
      ],
      meta: {}
    })
  })
})
