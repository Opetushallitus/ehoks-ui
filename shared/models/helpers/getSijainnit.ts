export function getSijainnit(
  hankitunOsaamisenNaytto: Array<{
    nayttoymparisto: { nimi: string }
  }>,
  osaamisenHankkimistavat: Array<{
    tyopaikallaHankittavaOsaaminen: { tyopaikanNimi: string }
  }>
) {
  return [
    ...hankitunOsaamisenNaytto.map(naytto => naytto.nayttoymparisto.nimi),
    ...osaamisenHankkimistavat.map(
      hankkimistapa =>
        hankkimistapa.tyopaikallaHankittavaOsaaminen.tyopaikanNimi
    )
  ]
}
