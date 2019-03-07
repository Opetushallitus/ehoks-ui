export function getHarjoittelujaksot(
  osaamisenHankkimistavat: Array<{
    alku: string
    loppu: string
    tyopaikallaHankittavaOsaaminen: {
      tyopaikanNimi: string
      keskeisetTyotehtavat: string[]
      vastuullinenOhjaaja: { nimi: string }
    }
  }>
) {
  return osaamisenHankkimistavat.map(tapa => {
    return {
      ajankohta: {
        alku: tapa.alku,
        loppu: tapa.loppu
      },
      hyvaksytty: "", // TODO: where to get this?
      ohjaaja: tapa.tyopaikallaHankittavaOsaaminen.vastuullinenOhjaaja.nimi,
      tyotehtavat: tapa.tyopaikallaHankittavaOsaaminen.keskeisetTyotehtavat
      // otsikko? osaamisenhankkimistavasta, työpaikalla oppiminen, lähiopetus
      // sijainti?
    }
  })
}
