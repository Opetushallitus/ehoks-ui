import { Instance, types } from "mobx-state-tree"

export const AppError = types
  .model("AppError", {
    id: types.string,
    errorText: types.optional(types.string, ""),
    handled: types.boolean
  })
  .actions(self => {
    const handle = () => {
      self.handled = true
    }
    return { handle }
  })

const ErrorStoreModel = {
  errors: types.optional(types.array(AppError), [])
}

export const ErrorStore = types
  .model("ErrorStore", ErrorStoreModel)
  .actions(self => {
    // logError can accept either a plain string or a translation key as the errorText parameter,
    // see HOKSStore for an example of translation key usage.
    const logError = (id: string, errorText?: string) => {
      const error = { errorText, id, handled: false }
      // Log error only if it is unique
      console.log("GOT ERROR: " + error.errorText + ", " + error.id)
      const index = self.errors.findIndex(
        err => err.errorText === error.errorText && err.handled === false
      )
      if (index <= -1) {
        console.log(
          "NO EXISTING ERROR FOUND IN STORE, PUSHING: " +
            error.errorText +
            ", " +
            error.id +
            " index: " +
            index
        )
        self.errors.push(error as any) // https://github.com/mobxjs/mobx-state-tree/issues/501
      } else {
        console.log(
          "NOT PUSHING: " +
            error.errorText +
            ", " +
            error.id +
            " index: " +
            index
        )
      }

      //self.errors.push(error as any) // https://github.com/mobxjs/mobx-state-tree/issues/501
    }
    return { logError }
  })
  .views(self => ({
    get unhandled(): IAppError[] {
      return self.errors.filter(error => !error.handled)
    }
  }))

export type IErrorStore = Instance<typeof ErrorStore>
export type IAppError = Instance<typeof AppError>
