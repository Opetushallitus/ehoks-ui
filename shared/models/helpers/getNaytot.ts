import { Naytto } from "./TutkinnonOsa"

export function getNaytot(
  hankitunOsaamisenNaytto: Array<{
    alku: string
    loppu: string
    jarjestaja: { oppilaitosOid: string }
    nayttoymparisto: { nimi: string; yTunnus: string; kuvaus: string }
    tyoelamaArvioijat: Array<{ nimi: string }>
    koulutuksenJarjestajaArvioijat: Array<{ nimi: string }>
    osaamistavoitteet?: string[]
  }>
): Naytto[] {
  return hankitunOsaamisenNaytto.map(naytto => ({
    ajankohta: { alku: naytto.alku, loppu: naytto.loppu },
    organisaatio: [naytto.nayttoymparisto.nimi, naytto.nayttoymparisto.yTunnus]
      .filter(Boolean)
      .join(", "),
    ymparisto: naytto.nayttoymparisto.kuvaus,
    arvioijat: [
      ...naytto.tyoelamaArvioijat,
      ...naytto.koulutuksenJarjestajaArvioijat
    ].map(arvioija => arvioija.nimi),
    tyotehtavat: [] // TODO
  }))
}
