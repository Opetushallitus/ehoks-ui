import { ErrorStore } from "stores/ErrorStore"
import { fetchUtils } from "fetchUtils"
import { StoreEnvironment } from "types/StoreEnvironment"

export function createEnvironment(
  fetchFn: GlobalFetch["fetch"]
): StoreEnvironment {
  return {
    ...fetchUtils(fetchFn),
    errors: ErrorStore.create({})
  }
}
