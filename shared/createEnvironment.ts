import { ErrorStore } from "stores/ErrorStore"
import { fetchUtils } from "fetchUtils"
import { StoreEnvironment } from "types/StoreEnvironment"

export function createEnvironment(
  fetchFn: WindowOrWorkerGlobalScope["fetch"],
  apiUrl: (path: string) => string,
  apiPrefix: string,
  callerId: (headers?: Headers) => Headers
): StoreEnvironment {
  return {
    ...fetchUtils(fetchFn),
    errors: ErrorStore.create({}),
    apiUrl,
    apiPrefix,
    callerId
  }
}
