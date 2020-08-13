import { getRoot, types } from "mobx-state-tree"
import { LocaleRoot } from "../helpers/LocaleRoot"

const EPerusteetNimi = types.model({
  fi: types.maybe(types.string),
  sv: types.maybe(types.string)
})

export const OsaAlueVastaus = types
  .model("OsaAlueVastaus", {
    id: types.maybe(types.number),
    koodiUri: types.maybe(types.string),
    nimi: types.optional(EPerusteetNimi, {})
  })
  .views(self => {
    const root: LocaleRoot = getRoot(self)
    return {
      get osaAlueNimi() {
        return self.nimi[root.translations.activeLocale]
          ? self.nimi[root.translations.activeLocale]
          : ""
      }
    }
  })
