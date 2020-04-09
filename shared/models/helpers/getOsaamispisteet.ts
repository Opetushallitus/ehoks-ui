import find from "lodash.find"

export function getOsaamispisteet(
  tutkinnonOsaViitteet: {
    laajuus: number
    suoritustapa: { suoritustapakoodi: string }
  }[]
) {
  const viite = find(tutkinnonOsaViitteet, v => v.laajuus !== undefined && v.suoritustapa.suoritustapakoodi === "ops")

  if (viite) {
    return viite.laajuus
  } else {
    return 0
  }
}
