import { fetchUtils } from "fetchUtils"
import { IErrorStore } from "stores/ErrorStore"

export type StoreEnvironment = ReturnType<typeof fetchUtils> & {
  errors: IErrorStore
  apiUrl: (path: string) => string
  apiPrefix: string
  appendCallerId: (headers?: Headers) => Headers
}
