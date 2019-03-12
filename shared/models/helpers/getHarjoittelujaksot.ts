import { Harjoittelujakso } from "models/helpers/TutkinnonOsa"

export function getHarjoittelujaksot(
  osaamisenHankkimistavat: Array<{
    alku: string
    loppu: string
    tyopaikallaHankittavaOsaaminen: {
      tyopaikanNimi: string
      keskeisetTyotehtavat: string[]
      vastuullinenOhjaaja: { nimi: string }
    }
    muutOppimisymparisto: { oppimisymparisto: { nimi: string; selite: string } }
  }>
) {
  return osaamisenHankkimistavat.map<Harjoittelujakso>(tapa => {
    return {
      ajankohta: {
        alku: tapa.alku,
        loppu: tapa.loppu
      },
      ohjaaja: tapa.tyopaikallaHankittavaOsaaminen
        ? tapa.tyopaikallaHankittavaOsaaminen.vastuullinenOhjaaja.nimi
        : "",
      tyotehtavat: tapa.tyopaikallaHankittavaOsaaminen
        ? tapa.tyopaikallaHankittavaOsaaminen.keskeisetTyotehtavat
        : [],
      nimi: tapa.muutOppimisymparisto
        ? tapa.muutOppimisymparisto.oppimisymparisto.nimi
        : "",
      selite: tapa.muutOppimisymparisto
        ? tapa.muutOppimisymparisto.oppimisymparisto.selite
        : tapa.tyopaikallaHankittavaOsaaminen.tyopaikanNimi,
      tyyppi: tapa.muutOppimisymparisto ? "WORKPLACE" : "OTHER"
    }
  })
}
