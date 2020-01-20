import { getHarjoittelujaksot } from "./getHarjoittelujaksot"
import { getNaytot } from "./getNaytot"
import { getOsaamisvaatimukset } from "./getOsaamisvaatimukset"
import { getOtsikko } from "./getOtsikko"
import { getTila } from "./getTila"
import { types, getRoot } from "mobx-state-tree"
import { LocaleRoot } from "models/helpers/LocaleRoot"
import { getOsaamispisteet } from "./getOsaamispisteet"
import { ShareType } from "stores/NotificationStore"
import find from "lodash.find"

// TODO: type tutkinnonOsa
export const TutkinnonOsaViews = types.model({}).views((self: any) => {
  const root: LocaleRoot = getRoot(self)
  return {
    get tila() {
      return getTila(self.osaamisenOsoittaminen, self.osaamisenHankkimistavat)
    },
    get naytot() {
      return getNaytot(self.osaamisenOsoittaminen)
    },
    get harjoittelujaksot() {
      return getHarjoittelujaksot(self.osaamisenHankkimistavat)
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
    opintoOtsikko(ospLyhenne: string): string {
      return getOtsikko(self, ospLyhenne)
    },
    hasNayttoOrHarjoittelujakso(koodiUri: string, type: ShareType | "", uuid: string) {
      if (koodiUri === "" && type === "") {
        return false
      }
      const uuidMatch = self.tutkinnonOsa.uuid === uuid
      const koodiUriMatch = self.tutkinnonOsaKoodiUri === koodiUri
      const typeMatch =
        type === "naytto"
          ? this.naytot.length > 0
          : !!find(this.harjoittelujaksot, hj => hj.tyyppi === "WORKPLACE")
      return koodiUriMatch && typeMatch && uuidMatch
    }
  }
})
