import { Naytto } from "./TutkinnonOsa"

export function getNaytot(
  hankitunOsaamisenNaytto: Array<{
    alku: string
    loppu: string
    jarjestaja: { oppilaitosOid: string }
    nayttoymparisto: { nimi: string; yTunnus: string; kuvaus: string }
    tyoelamaArvioijat: Array<{ nimi: string; organisaatio: { nimi: string } }>
    koulutuksenJarjestajaArvioijat: Array<{
      nimi: string
      organisaatio: { oppilaitosOid: string }
    }>
    keskeisetTyotehtavatNaytto: string[]
  }>
) {
  return hankitunOsaamisenNaytto.map<Naytto>(naytto => ({
    alku: naytto.alku,
    loppu: naytto.loppu,
    organisaatio: naytto.nayttoymparisto.nimi,
    ymparisto: naytto.nayttoymparisto.kuvaus,
    koulutuksenJarjestajaArvioijat: naytto.koulutuksenJarjestajaArvioijat.map(
      a =>
        // TODO: fetch oppilaitos using oppilaitosOid
        [a.nimi, a.organisaatio.oppilaitosOid].filter(Boolean).join(", ")
    ),
    tyoelamaArvioijat: naytto.tyoelamaArvioijat.map(a =>
      [a.nimi, a.organisaatio.nimi].filter(Boolean).join(", ")
    ),

    tyotehtavat: naytto.keskeisetTyotehtavatNaytto,
    tyyppi: "DEMONSTRATION"
  }))
}
