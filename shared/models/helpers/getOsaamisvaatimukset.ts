import flattenDeep from "lodash.flattendeep"
import { Locale } from "../../stores/TranslationStore";

export function getOsaamisvaatimukset(
  arviointi: {
    arvioinninKohdealueet: Array<{
      otsikko: { fi: string; sv: string }
      arvioinninKohteet: Array<{
        otsikko: { fi: string; sv: string } | null
        arviointiAsteikko: string
        osaamistasonKriteerit: Array<{
          osaamistaso: string
          kriteerit: Array<{ fi: string; sv: string }>
        }>
      }>
    }>
  } | null,
  activeLocale: Locale.FI | Locale.SV
) {
  if (!arviointi) {
    return []
  }
  return arviointi.arvioinninKohdealueet.map(kohdeAlue => {
    return {
      kuvaus: kohdeAlue.otsikko[activeLocale],
      kriteerit: kohdeAlue.arvioinninKohteet.map(arvioinninKohde => {
        return {
          kuvaus: arvioinninKohde.otsikko
            ? arvioinninKohde.otsikko[activeLocale]
            : "",
          kriteerit: flattenDeep<string>(
            arvioinninKohde.osaamistasonKriteerit.map(tasoKriteeri => {
              return tasoKriteeri.kriteerit.map(
                kriteeri =>
                  `${tasoKriteeri.osaamistaso}: ${kriteeri[activeLocale]}`
              )
            })
          ).sort()
        }
      })
    }
  })
}
