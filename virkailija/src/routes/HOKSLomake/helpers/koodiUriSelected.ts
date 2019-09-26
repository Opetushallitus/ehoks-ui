import { updateCodeVersionAt } from "./updateCodeVersionAt"

export const koodiUriSelected = (self: any, callback?: () => void) => (
  path: string,
  selected: boolean
) => {
  return new Promise(resolve => {
    self.setState(
      (state: any) => {
        return {
          ...state,
          formData: updateCodeVersionAt(
            path,
            selected,
            state.formData,
            state.koodiUris
          )
        }
      },
      () => {
        if (typeof callback === "function") {
          callback()
        }
        resolve()
      }
    )
  })
}
