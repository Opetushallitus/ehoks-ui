import { Harjoittelujakso } from "models/helpers/TutkinnonOsa"

export function getHarjoittelujaksot(
  osaamisenHankkimistavat: Array<{
    alku: string
    loppu: string
    tyopaikallaJarjestettavaKoulutus: {
      tyopaikanNimi: string
      keskeisetTyotehtavat: string[]
      vastuullinenTyopaikkaOhjaaja: { nimi: string }
    }
    muutOppimisymparistot: Array<{
      oppimisymparisto: { nimi: string }
      selite: string
    }>
  }>
) {
  return osaamisenHankkimistavat.map<Harjoittelujakso>(tapa => {
    const tyyppi = tapa.muutOppimisymparistot.length > 0 ? "OTHER" : "WORKPLACE"

    return {
      alku: tapa.alku,
      loppu: tapa.loppu,
      ohjaaja: tapa.tyopaikallaJarjestettavaKoulutus
        ? tapa.tyopaikallaJarjestettavaKoulutus.vastuullinenTyopaikkaOhjaaja
            .nimi
        : "",
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
