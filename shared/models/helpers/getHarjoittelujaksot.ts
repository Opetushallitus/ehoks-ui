import { Harjoittelujakso } from "models/helpers/TutkinnonOsa"

export function getHarjoittelujaksot(
  osaamisenHankkimistavat: Array<{
    alku: string
    loppu: string
    tyopaikallaJarjestettavaKoulutus: {
      tyopaikanNimi: string
      keskeisetTyotehtavat: string[]
      vastuullinenTyopaikkaOhjaaja: { nimi: string; sahkoposti: string }
    }
    muutOppimisymparistot: Array<{
      oppimisymparisto: { nimi: string }
      selite: string
    }>
    osaamisenHankkimistapaKoodiUri: string
  }>
) {
  return osaamisenHankkimistavat.map<Harjoittelujakso>(tapa => {
    const tyyppi = tapa.osaamisenHankkimistapaKoodiUri.includes("koulutussopimus") || tapa.osaamisenHankkimistapaKoodiUri.includes("oppisopimus")
        ? "WORKPLACE"
        : "OTHER"

    return {
      alku: tapa.alku,
      loppu: tapa.loppu,
      ohjaaja: tapa.tyopaikallaJarjestettavaKoulutus
        ? tapa.tyopaikallaJarjestettavaKoulutus.vastuullinenTyopaikkaOhjaaja
        : undefined,
      tyotehtavat: tapa.tyopaikallaJarjestettavaKoulutus
        ? tapa.tyopaikallaJarjestettavaKoulutus.keskeisetTyotehtavat
        : [],
      nimi:
        tapa.muutOppimisymparistot.length > 0 &&
        tapa.muutOppimisymparistot[0].oppimisymparisto
          ? tapa.muutOppimisymparistot[0].oppimisymparisto.nimi
          : "",
      selite:
        tapa.muutOppimisymparistot.length > 0
          ? tapa.muutOppimisymparistot[0].selite
          : tapa.tyopaikallaJarjestettavaKoulutus.tyopaikanNimi,
      tyyppi
    }
  })
}
