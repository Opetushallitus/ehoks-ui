import flattenDeep from "lodash.flattendeep"

export function getOsaamisvaatimukset(
  arviointi: {
    arvioinninKohdealueet: Array<{
      otsikko: { fi: string; sv: string }
      arvioinninKohteet: Array<{
        otsikko: { fi: string; sv: string }
        arviointiAsteikko: string
        osaamistasonKriteerit: Array<{
          osaamistaso: string
          kriteerit: Array<{ fi: string; sv: string }>
        }>
      }>
    }>
  },
  activeLocale: "fi" | "sv"
) {
  return arviointi.arvioinninKohdealueet.map(kohdeAlue => {
    return {
      kuvaus: kohdeAlue.otsikko[activeLocale],
      kriteerit: kohdeAlue.arvioinninKohteet.map(arvioinninKohde => {
        return {
          kuvaus: arvioinninKohde.otsikko[activeLocale],
          kriteerit: flattenDeep(
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
