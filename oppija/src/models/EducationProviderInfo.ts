import { Instance, types } from "mobx-state-tree"
import { LanguageVersion } from "models/LanguageVersion"

export const EducationProviderInfo = types.model("EducationProviderInfo", {
  basicInformation: types.optional(LanguageVersion, {}),
  hoksProcess: types.optional(LanguageVersion, {})
})

export type IEducationProviderInfo = Instance<typeof EducationProviderInfo>
