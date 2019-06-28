import { Instance, types } from "mobx-state-tree";

export const OrganisationModel = types.model("Organisation", {
  oid: types.string,
  nimi: types.map(types.string)
})

export type IOrganisation = Instance<typeof OrganisationModel>