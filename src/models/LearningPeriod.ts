import { types } from "mobx-state-tree"

export const LearningPeriod = types.model("LearningPeriod", {
  comments: types.optional(types.array(types.string), []),
  company: types.string,
  endDate: types.string,
  id: types.integer,
  startDate: types.string,
  title: types.string
})
