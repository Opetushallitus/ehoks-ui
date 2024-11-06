import { getRoot, Instance, types } from "mobx-state-tree"
import {
  EPerusteetArviointi,
  EPerusteetNimi,
  EPerusteKoodi
} from "../EPerusteetVastaus"
import { IRootStore } from "../../../virkailija/src/stores/RootStore"
import { Locale } from "../../stores/TranslationStore"

const OsaamisTavoitteet = types.model({
  laajuus: types.optional(types.number, 0, [null, undefined]),
  pakollinen: types.maybe(types.boolean),
  arviointi: types.maybeNull(EPerusteetArviointi)
})

export const OsaAlueVastaus = types
  .model("OsaAlueVastaus", {
    koodiUri: types.maybe(types.string),
    nimi: types.optional(EPerusteetNimi, {}),
    koodi: types.optional(EPerusteKoodi, {}),
    osaamistavoitteet: types.array(OsaamisTavoitteet)
  })
  .views((self) => {
    const root: IRootStore = getRoot(self)
    const activeLocale: Locale = root.translations.activeLocale
    return {
      get osaAlueNimi(): JSX.Element | string {
        return (
          self.koodi?.nimi[activeLocale] ||
          self.nimi[activeLocale] ||
          self.koodi?.nimi.fi ||
          self.nimi.fi
        )
      },
      get laajuus() {
        return self.osaamistavoitteet
          .filter((osaamistavoite) => osaamistavoite.pakollinen)
          .reduce((sum, osaamistavoite) => sum + osaamistavoite.laajuus, 0)
      }
    }
  })

export type IOsaAlueVastaus = Instance<typeof OsaAlueVastaus>
