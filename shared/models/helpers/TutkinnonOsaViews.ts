import { getHarjoittelujaksot } from "./getHarjoittelujaksot"
import { getNaytot } from "./getNaytot"
import { getOsaamisvaatimukset } from "./getOsaamisvaatimukset"
import { getOtsikko } from "./getOtsikko"
import { getSijainnit } from "./getSijainnit"
import { getTila } from "./getTila"
import { types, getRoot } from "mobx-state-tree"
import { LocaleRoot } from "models/helpers/LocaleRoot"

// TODO: type tutkinnonOsa
export const TutkinnonOsaViews = types.model({}).views((self: any) => {
  const root: LocaleRoot = getRoot(self)
  return {
    get tila() {
      return getTila(self.hankitunOsaamisenNaytto, self.osaamisenHankkimistavat)
    },
    get naytot() {
      return getNaytot(self.hankitunOsaamisenNaytto)
    },
    get sijainnit() {
      return getSijainnit(
        self.hankitunOsaamisenNaytto,
        self.osaamisenHankkimistavat
      )
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
    opintoOtsikko(ospLyhenne: string): string {
      return getOtsikko(self, ospLyhenne)
    }
  }
})
