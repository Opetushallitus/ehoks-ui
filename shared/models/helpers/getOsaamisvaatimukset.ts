import flattenDeep from "lodash.flattendeep"
import { Locale } from "../../stores/TranslationStore"

export function getOsaamisvaatimukset(
  arviointi: {
    arvioinninKohdealueet: {
      otsikko: { fi: string; sv: string }
      arvioinninKohteet: {
        otsikko: { fi: string; sv: string } | null
        arviointiAsteikko: string
        osaamistasonKriteerit: {
          osaamistaso: string
          kriteerit: { fi: string; sv: string }[]
        }[]
      }[]
    }[]
  } | null,
  activeLocale: Locale.FI | Locale.SV
) {
  if (!arviointi) {
    return []
  }
  return arviointi.arvioinninKohdealueet.map(kohdeAlue => ({
    kuvaus: kohdeAlue.otsikko[activeLocale],
    kriteerit: kohdeAlue.arvioinninKohteet.map(arvioinninKohde => ({
      kuvaus: arvioinninKohde.otsikko
        ? arvioinninKohde.otsikko[activeLocale]
        : "",
      kriteerit: flattenDeep<string>(
        arvioinninKohde.osaamistasonKriteerit.map(tasoKriteeri =>
          tasoKriteeri.kriteerit.map(kriteeri =>
            arvioinninKohde.arviointiAsteikko === "1"
              ? `${kriteeri[activeLocale]}`
              : `${tasoKriteeri.osaamistaso}: ${kriteeri[activeLocale]}`
          )
        )
      ).sort()
    }))
  }))
}
