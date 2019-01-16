import { fetchUtils } from "fetchUtils"
import { IErrorStore } from "stores/ErrorStore"

export type StoreEnvironment = ReturnType<typeof fetchUtils> & {
  errors: IErrorStore
}
