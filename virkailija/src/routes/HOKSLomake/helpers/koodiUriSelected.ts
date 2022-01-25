import { updateCodeVersionAt } from "./updateCodeVersionAt"

export const koodiUriSelected = (self: any, callback?: () => void) => (
  path: string,
  selected: boolean
) =>
  new Promise<void>(resolve => {
    self.setState(
      (state: any) => ({
        ...state,
        formData: updateCodeVersionAt(
          path,
          selected,
          state.formData,
          state.koodiUris
        )
      }),
      () => {
        if (typeof callback === "function") {
          callback()
        }
        resolve()
      }
    )
  })
