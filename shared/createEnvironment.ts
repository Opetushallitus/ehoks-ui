import { ErrorStore } from "stores/ErrorStore"
import { fetchUtils } from "fetchUtils"
import { StoreEnvironment } from "types/StoreEnvironment"

export const createEnvironment = (
  fetchFn: WindowOrWorkerGlobalScope["fetch"],
  apiUrl: (path: string) => string,
  apiPrefix: string,
  appendCallerId: (headers?: Headers) => Headers
): StoreEnvironment => ({
  ...fetchUtils(fetchFn),
  errors: ErrorStore.create({}),
  apiUrl,
  apiPrefix,
  appendCallerId
})
