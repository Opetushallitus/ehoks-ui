import { Instance, types } from "mobx-state-tree"
import { LanguageVersion } from "models/LanguageVersion"

export const WorkplaceProviderInfo = types.model("WorkplaceProviderInfo", {
  basicInformation: types.optional(LanguageVersion, {}),
  hoksProcess: types.optional(LanguageVersion, {})
})

export interface IWorkplaceProviderInfo
  extends Instance<typeof WorkplaceProviderInfo> {}
