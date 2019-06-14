export function getSijainnit(
  osaamisenOsoittaminen: Array<{
    nayttoymparisto: { nimi: string }
  }>,
  osaamisenHankkimistavat: Array<{
    tyopaikallaJarjestettavaKoulutus: { tyopaikanNimi: string }
  }>
) {
  return [
    ...osaamisenOsoittaminen.map(naytto => naytto.nayttoymparisto.nimi),
    ...osaamisenHankkimistavat.map(
      hankkimistapa =>
        hankkimistapa.tyopaikallaJarjestettavaKoulutus.tyopaikanNimi
    )
  ]
}
