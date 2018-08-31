import { types } from "mobx-state-tree"

export const SessionUser = types.model("SessionUser", {
  commonName: types.string,
  firstName: types.string,
  surname: types.string
})
