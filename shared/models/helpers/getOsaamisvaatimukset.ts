import { Locale } from "../../stores/TranslationStore"

function groupOsaamistasot(
  osaamistasonKriteerit: {
    osaamistaso: string
    kriteerit: {
      fi: string
      sv: string
    }[]
  }[],
  activeLocale: Locale.FI | Locale.SV
) {
  const records = osaamistasonKriteerit.reduce((acc, tasoKriteeri) => {
    const { osaamistaso } = tasoKriteeri
    acc[osaamistaso] = (acc[osaamistaso] || []).concat(
      tasoKriteeri.kriteerit.map(kriteeri => kriteeri[activeLocale])
    )
    return acc
  }, {} as Record<string, string[]>)
  return (
    Object.entries(records).map(([key, value]) => ({
      osaamistaso: key,
      kriteerit: value
    })) || []
  )
}
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
          osaamistasonKriteerit: groupOsaamistasot(
            arvioinninKohde.osaamistasonKriteerit,
            activeLocale
          ),
          arviointiAsteikko: arvioinninKohde.arviointiAsteikko
        }
      })
    }
  })
}
