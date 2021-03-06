import { types } from "mobx-state-tree"

export const TutkinnonOsaViite = types.model("TutkinnonOsaViite", {
  id: types.optional(types.number, 0),
  moduleId: types.optional(types.string, ""),
  laajuus: types.optional(types.number, 0),
  suoritustapa: types.optional(
    types.model({
      suoritustapakoodi: types.optional(types.string, "")
    }),
    {}
  )
})
