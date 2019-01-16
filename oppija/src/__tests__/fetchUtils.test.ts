import { apiUrl } from "config"
import { fetchUtils, mockFetch } from "fetchUtils"

describe("fetchUtils", () => {
  test("fetchSingle camelCases object keys", async () => {
    // uses session_opintopolku_1.json mock
    const { fetchSingle } = fetchUtils(mockFetch(apiUrl, 1))

    const result = await fetchSingle(apiUrl("session"))
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
    const { fetchCollection } = fetchUtils(mockFetch(apiUrl))

    const result = await fetchCollection(apiUrl("lokalisointi"))
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
