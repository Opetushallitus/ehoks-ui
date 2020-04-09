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
      self.errors.push(error as any) // https://github.com/mobxjs/mobx-state-tree/issues/501
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
