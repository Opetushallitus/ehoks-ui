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
    const logError = (id: string, errorText?: string) => {
      const error = { errorText, id, handled: false }
      self.errors.push(error as any) // https://github.com/mobxjs/mobx-state-tree/issues/501
    }
    return { logError }
  })
  .views(self => {
    return {
      get unhandled(): Array<Instance<typeof AppError>> {
        return self.errors.filter(error => !error.handled)
      }
    }
  })

export interface IErrorStore extends Instance<typeof ErrorStore> {}
