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
    muutOppimisymparisto: Array<{
      oppimisymparisto: { nimi: string }
      selite: string
    }>
  }>
) {
  return osaamisenHankkimistavat.map<Harjoittelujakso>(tapa => {
    const tyyppi = tapa.muutOppimisymparisto.length > 0 ? "OTHER" : "WORKPLACE"
    return {
      alku: tapa.alku,
      loppu: tapa.loppu,
      ohjaaja: tapa.tyopaikallaHankittavaOsaaminen
        ? tapa.tyopaikallaHankittavaOsaaminen.vastuullinenOhjaaja.nimi
        : "",
      tyotehtavat: tapa.tyopaikallaHankittavaOsaaminen
        ? tapa.tyopaikallaHankittavaOsaaminen.keskeisetTyotehtavat
        : [],
      nimi:
        tapa.muutOppimisymparisto.length > 0 &&
        tapa.muutOppimisymparisto[0].oppimisymparisto
          ? tapa.muutOppimisymparisto[0].oppimisymparisto.nimi
          : "",
      selite:
        tapa.muutOppimisymparisto.length > 0
          ? tapa.muutOppimisymparisto[0].selite
          : tapa.tyopaikallaHankittavaOsaaminen.tyopaikanNimi,
      tyyppi
    }
  })
}
