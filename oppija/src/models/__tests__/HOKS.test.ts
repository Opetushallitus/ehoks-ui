import { createEnvironment } from "createEnvironment"
import { mockFetch } from "fetchUtils"
import { RootStore } from "../../stores/RootStore"

const apiUrl = (path: string) => `/${path}`
const callerId = (headers?: Headers) => (headers ? headers : new Headers())

test("Osaamisala is read from opiskeluOikeus", () => {
  const root = RootStore.create(
    {
      hoks: {
        suunnitelmat: [
          {
            sahkoposti: "jep@jep.fi",
            opiskeluOikeus: {
              suoritukset: [
                {
                  osaamisala: [
                    {
                      alku: "2019-01-31",
                      loppu: "2020-05-29",
                      osaamisala: {
                        nimi: { fi: "Toimitilahuollon osaamisala" }
                      }
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    },
    createEnvironment(mockFetch(apiUrl), apiUrl, "", callerId)
  )

  expect(root.hoks.suunnitelmat[0].osaamisala).toBe(
    "Toimitilahuollon osaamisala"
  )
})
