import { getRoot, types } from "mobx-state-tree"
import { LocaleRoot } from "./helpers/LocaleRoot"

export const Organisaatio = types
  .model("Organisaatio", {
    oid: types.optional(types.string, ""),
    nimi: types.optional(
      types.model({
        fi: types.optional(types.string, ""),
        sv: types.optional(types.string, "")
      }),
      {}
    )
  })
  .views(self => {
    const root: LocaleRoot = getRoot(self)
    return {
      get organisaatioNimi() {
        return self.nimi[root.translations.activeLocale]
      }
    }
  })
