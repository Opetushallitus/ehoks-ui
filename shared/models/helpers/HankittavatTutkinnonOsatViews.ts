import { getOsaamisvaatimukset } from "./getOsaamisvaatimukset"
import { getOtsikko } from "./getOtsikko"
import { getTila } from "./getTila"
import { types, getRoot } from "mobx-state-tree"
import { LocaleRoot } from "models/helpers/LocaleRoot"
import { getOsaamispisteet } from "./getOsaamispisteet"
import find from "lodash.find"
import { OsaamisenHankkimistapaType } from "../OsaamisenHankkimistapa"
import { ShareType, TutkinnonOsaType } from "./ShareTypes"

export const HankittavatTutkinnonOsatViews = types
  .model({})
  .views((self: any) => {
    const root: LocaleRoot = getRoot(self)
    return {
      get tila() {
        if (self.tyyppi !== TutkinnonOsaType.HankittavaKoulutuksenOsa) {
          return getTila(
            self.osaamisenOsoittaminen,
            self.osaamisenHankkimistavat
          )
        } else {
          return "aikataulutettu"
        }
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
        if (self.tyyppi !== TutkinnonOsaType.HankittavaKoulutuksenOsa) {
          return getOsaamispisteet(self.tutkinnonOsaViitteet)
        } else {
          return 0
        }
      },
      opintoOtsikko(ospLyhenne: string) {
        if (self.tyyppi !== TutkinnonOsaType.HankittavaKoulutuksenOsa) {
          return getOtsikko(self, ospLyhenne)
        } else {
          return "TEMP otsikko koulutuksen osa"
        }
      },
      hasNayttoOrHarjoittelujakso(type?: ShareType, moduleId?: string) {
        if (!moduleId && !type) {
          return false
        }
        const moduleIdMatch = self.moduleId === moduleId
        const typeMatch =
          type === ShareType.osaamisenosoittaminen
            ? self.osaamisenOsoittaminen?.length > 0
            : !!find(
                self.osaamisenHankkimistavat,
                oh => oh.tyyppi === OsaamisenHankkimistapaType.Workplace
              )
        return moduleIdMatch && typeMatch
      }
    }
  })
