import { getOsaamisvaatimukset } from "./getOsaamisvaatimukset"
import { getOtsikko } from "./getOtsikko"
import { getTila } from "./getTila"
import { types, getRoot } from "mobx-state-tree"
import { LocaleRoot } from "models/helpers/LocaleRoot"
import { getOsaamispisteet } from "./getOsaamispisteet"
import { ShareType } from "stores/NotificationStore"
import find from "lodash.find"
import { OsaamisenHankkimistapaType } from "../OsaamisenHankkimistapa"

export const HankittavatTutkinnonOsatViews = types
  .model({})
  .views((self: any) => {
    const root: LocaleRoot = getRoot(self)
    return {
      get tila() {
        return getTila(self.osaamisenOsoittaminen, self.osaamisenHankkimistavat)
      },
      get osaamisvaatimukset() {
        if (!self.tutkinnonOsa) {
          return []
        }
        return getOsaamisvaatimukset(
          self.tutkinnonOsa.arviointi,
          root.translations.activeLocale
        )
      },
      get osaamispisteet() {
        return getOsaamispisteet(self.tutkinnonOsaViitteet)
      },
      opintoOtsikko: (ospLyhenne: string): string => getOtsikko(self, ospLyhenne),
      hasNayttoOrHarjoittelujakso(koodiUri: string, type: ShareType | "") {
        if (koodiUri === "" && type === "") {
          return false
        }
        const koodiUriMatch = self.tutkinnonOsaKoodiUri === koodiUri
        const typeMatch =
          type === "naytto"
            ? self.osaamisenOsoittaminen?.length > 0
            : !!find(
                self.osaamisenHankkimistavat,
                oh => oh.tyyppi === OsaamisenHankkimistapaType.Workplace
              )
        return koodiUriMatch && typeMatch
      }
    }
  })
