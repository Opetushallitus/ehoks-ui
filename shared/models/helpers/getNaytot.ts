import { Naytto } from "./TutkinnonOsa"

export function getNaytot(
  osaamisenOsoittaminen: Array<{
    alku: string
    loppu: string
    jarjestaja: { oppilaitosOid: string }
    nayttoymparisto: { nimi: string; yTunnus: string; kuvaus: string }
    tyoelamaOsaamisenArvioijat: Array<{
      nimi: string
      organisaatio: { nimi: string }
    }>
    koulutuksenJarjestajaOsaamisenArvioijat: Array<{
      nimi: string
      organisaatio: { oppilaitosOid: string }
    }>
    sisallonKuvaus: string[]
  }>
) {
  return osaamisenOsoittaminen.map<Naytto>(naytto => ({
    alku: naytto.alku,
    loppu: naytto.loppu,
    organisaatio: naytto.nayttoymparisto.nimi,
    ymparisto: naytto.nayttoymparisto.kuvaus,
    koulutuksenJarjestajaArvioijat: naytto.koulutuksenJarjestajaOsaamisenArvioijat.map(
      a =>
        // TODO: fetch oppilaitos using oppilaitosOid
        [a.nimi, a.organisaatio.oppilaitosOid].filter(Boolean).join(", ")
    ),
    tyoelamaArvioijat: naytto.tyoelamaOsaamisenArvioijat.map(a =>
      [a.nimi, a.organisaatio.nimi].filter(Boolean).join(", ")
    ),

    tyotehtavat: naytto.sisallonKuvaus,
    tyyppi: "DEMONSTRATION"
  }))
}
