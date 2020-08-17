import { getRoot, Instance, types } from "mobx-state-tree"
import { LocaleRoot } from "../helpers/LocaleRoot"

const EPerusteetNimi = types.model({
  fi: types.maybe(types.string),
  sv: types.maybe(types.string)
})

const OsaamisTavoitteet = types.model({
  laajuus: types.optional(types.number, 0)
})

export const OsaAlueVastaus = types
  .model("OsaAlueVastaus", {
    koodiUri: types.maybe(types.string),
    nimi: types.optional(EPerusteetNimi, {}),
    osaamistavoitteet: types.array(OsaamisTavoitteet)
  })
  .views(self => {
    const root: LocaleRoot = getRoot(self)
    return {
      get osaAlueNimi() {
        return self.nimi[root.translations.activeLocale]
          ? self.nimi[root.translations.activeLocale]
          : ""
      },
      get laajuus() {
        return self.osaamistavoitteet.reduce(
          (sum, osaamistavoite) => sum + osaamistavoite.laajuus,
          0
        )
      }
    }
  })

export type IOsaAlueVastaus = Instance<typeof OsaAlueVastaus>
