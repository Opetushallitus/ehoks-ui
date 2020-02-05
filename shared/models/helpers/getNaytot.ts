import { Naytto, OsaamisenOsoittaminen } from "./TutkinnonOsa"

export function getNaytot(osaamisenOsoittaminen: Array<OsaamisenOsoittaminen>) {
  return osaamisenOsoittaminen.map<Naytto>(naytto => ({
    alku: naytto.alku,
    loppu: naytto.loppu,
    organisaatio: naytto.nayttoymparisto.nimi,
    ymparisto: naytto.nayttoymparisto.kuvaus,
    koulutuksenJarjestajaArvioijat: naytto.koulutuksenJarjestajaOsaamisenArvioijat.map(
      a => [a.nimi, a.organisaatio.oppilaitosNimi].filter(Boolean).join(", ")
    ),
    tyoelamaArvioijat: naytto.tyoelamaOsaamisenArvioijat.map(a =>
      [a.nimi, a.organisaatio.nimi].filter(Boolean).join(", ")
    ),
    yksilollisetKriteerit: naytto.yksilollisetKriteerit,
    vaatimuksistaTaiTavoitteistaPoikkeaminen: naytto.vaatimuksistaTaiTavoitteistaPoikkeaminen,
    tyotehtavat: naytto.sisallonKuvaus,
    tyyppi: "DEMONSTRATION"
  }))
}
