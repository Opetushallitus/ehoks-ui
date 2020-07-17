import { types, Instance } from "mobx-state-tree"

export const OpiskelijapalauteTila = types.model("OpiskelijapalauteTila", {
  hoksId: types.integer,
  oppijaOid: types.string,
  alkupvm: types.string,
  lahetyspvm: types.string,
  sahkoposti: types.string,
  tyyppi: types.string,
  voimassaLoppupvm: types.string
})

export type IOpiskelijapalauteTila = Instance<typeof OpiskelijapalauteTila>
