import { getRoot, Instance, types } from "mobx-state-tree"
import { LocaleRoot } from "../helpers/LocaleRoot"
import { EPerusteetArviointi, EPerusteetNimi } from "../EPerusteetVastaus"

const OsaamisTavoitteet = types.model({
  laajuus: types.optional(types.number, 0, [null, undefined]),
  pakollinen: types.maybe(types.boolean),
  arviointi: types.maybeNull(EPerusteetArviointi)
})

const fallbackValue = (koodiUri?: string) => {
  try {
    return koodiUri ? "⚠️  " + koodiUri.split("_")[1].toUpperCase() : ""
  } catch (e) {
    return "⚠️ "
  }
}

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
          : fallbackValue(self.koodiUri)
      },
      get laajuus() {
        return self.osaamistavoitteet
          .filter(osaamistavoite => osaamistavoite.pakollinen)
          .reduce((sum, osaamistavoite) => sum + osaamistavoite.laajuus, 0)
      }
    }
  })

export type IOsaAlueVastaus = Instance<typeof OsaAlueVastaus>
