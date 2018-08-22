import { types } from "mobx-state-tree"
import { LanguageVersion } from "models/LanguageVersion"

export const StudentInfo = types.model("StudentInfo", {
  basicInformation: types.optional(LanguageVersion, {}),
  hoksProcess: types.optional(LanguageVersion, {})
})
