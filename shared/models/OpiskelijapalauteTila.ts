import { types, Instance } from "mobx-state-tree"

export const OpiskelijapalauteTila = types.model("OpiskelijapalauteTila", {
  hoksId: types.integer,
  oppijaOid: types.optional(types.string, ""),
  alkupvm: types.optional(types.string, ""),
  lahetyspvm: types.optional(types.string, ""),
  sahkoposti: types.optional(types.string, ""),
  tyyppi: types.optional(types.string, ""),
  voimassaLoppupvm: types.optional(types.string, ""),
  lahetystila: types.optional(types.string, "")
})

export type IOpiskelijapalauteTila = Instance<typeof OpiskelijapalauteTila>
