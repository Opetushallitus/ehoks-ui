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
      isLoading: false,
      learningPeriods: [],
      session: { isLoading: false, loginUrl: "", user: null, error: "" },
      student: {
        info: {
          basicInformation: { fi: "", sv: "" },
          hoksProcess: { fi: "", sv: "" }
        },
        isLoading: false
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
    // uses api_v1_session_opintopolku_1.json mock
    const store = RootStore.create({}, { fetch: mockFetch(1) })

    const result: ApiResponse<any> = await store.fetchSingle(
      apiUrl("session/opintopolku/")
    )
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
})
