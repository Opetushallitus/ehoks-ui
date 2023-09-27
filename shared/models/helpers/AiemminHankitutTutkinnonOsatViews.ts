import { types, getRoot } from "mobx-state-tree"
import { LocaleRoot } from "models/helpers/LocaleRoot"
import { getOtsikko } from "./getOtsikko"

export const AiemminHankitutTutkinnonOsatViews = types
  .model({})
  .views((self: any) => {
    const root: LocaleRoot = getRoot(self)
    return {
      get todentamisenProsessi() {
        return {
          koodiUri: self.valittuTodentamisenProsessiKoodiUri,
          lahetettyArvioitavaksi:
            self.tarkentavatTiedotOsaamisenArvioija.lahetettyArvioitavaksi
        }
      },
      opintoOtsikko: (ospLyhenne: string): JSX.Element | string => {
        const translations = root.translations
        const message =
          translations.messages[translations.activeLocale][
            "errors.OsaAlueVastaus.nimeaEiLoytynyt"
          ]
        return getOtsikko(
          self,
          ospLyhenne,
          message || "tietojen lataaminen ePerusteet-palvelusta ei onnistunut."
        )
      }
    }
  })
