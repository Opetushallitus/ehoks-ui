export interface APIResponse<D, M = undefined> {
  meta:
    | M
    | {
        [name: string]: any
      }
  data: D
}
