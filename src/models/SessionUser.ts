import { types } from "mobx-state-tree"

const Contact = types.model("Contact", {
  type: types.string,
  value: types.string
})

const ContactValue = types.model("ContactValue", {
  contact: types.array(Contact),
  id: types.number
})

export const SessionUser = types.model("SessionUser", {
  commonName: types.string,
  contactValuesGroup: types.optional(types.array(ContactValue), []),
  firstName: types.optional(types.string, ""),
  firstNames: types.optional(types.string, ""),
  oid: types.optional(types.string, ""),
  surname: types.string
})
