import { osaamisvaatimukset } from "mocks/mockOsaamisvaatimukset"
import { Opinto } from "models/Opinto"
import { SnapshotOrInstance } from "mobx-state-tree"

export const opinnot: Array<SnapshotOrInstance<typeof Opinto>> = [
  {
    osaamisvaatimukset: [...osaamisvaatimukset],
    osaamispisteet: 35,
    id: 0,
    tila: "aikataulutettu",
    sijainnit: ["Opinpaikka", "Lähiopetus"],
    harjoittelujaksot: [
      {
        ajankohta: { alku: "2019-05-24", loppu: "2019-05-31" },
        ohjaaja: "Etunimi Sukunimi, Organisaatio",
        tyotehtavat: [
          "Ensimmäinen tehtävä ja kuvaus tehtävän sisällöstä",
          "Toinen tehtävä ja kuvaus tehtävän sisällöstä",
          "Kolmas tehtävä ja kuvaus tehtävän sisällöstä",
          "Neljäs tehtävä ja kuvaus tehtävän sisällöstä"
        ]
      }
    ],
    naytot: [
      {
        ajankohta: { alku: "2019-08-01" },
        organisaatio: "Organisaation nimi",
        ymparisto: "Kuvaus näyttöympäristöstä",
        arvioijat: ["Etunimi Sukunimi", "Etunimi Sukunimi", "Etunimi Sukunimi"],
        tyotehtavat: [
          "Tehtävä ja kuvaus tehtävän sisällöstä",
          "Tehtävä ja kuvaus tehtävän sisällöstä"
        ]
      }
    ],
    otsikko: "Ikääntyvien osallisuuden edistäminen"
  },
  {
    osaamisvaatimukset: [],
    osaamispisteet: 4,
    id: 1,
    tila: "aikataulutettu",
    harjoittelujaksot: [
      {
        ajankohta: { alku: "2019-05-01", loppu: "2019-05-31" },
        ohjaaja: "Etunimi Sukunimi, Organisaatio",
        tyotehtavat: [
          "Tehtävä ja kuvaus tehtävän sisällöstä",
          "Tehtävä ja kuvaus tehtävän sisällöstä",
          "Tehtävä ja kuvaus tehtävän sisällöstä",
          "Tehtävä ja kuvaus tehtävän sisällöstä"
        ]
      }
    ],
    naytot: [
      {
        ajankohta: { alku: "2019-08-30" },
        organisaatio: "Organisaation nimi",
        ymparisto: "Kuvaus näyttöympäristöstä",
        arvioijat: ["Etunimi Sukunimi", "Etunimi Sukunimi", "Etunimi Sukunimi"],
        tyotehtavat: [
          "Tehtävä ja kuvaus tehtävän sisällöstä",
          "Tehtävä ja kuvaus tehtävän sisällöstä"
        ]
      }
    ],
    sijainnit: ["Tavastia", "Verkko-opetus"],
    otsikko: "Viestintä ja vuorovaikutus suomi toisena kielenä"
  },
  {
    osaamisvaatimukset: [],
    osaamispisteet: 40,
    id: 0,
    tila: "valmis",
    sijainnit: ["Palvelutalo Villilän niemi", "Työpaikalla oppiminen"],
    harjoittelujaksot: [
      {
        ajankohta: { alku: "2018-03-01", loppu: "2018-05-31" },
        ohjaaja: "",
        tyotehtavat: []
      }
    ],
    otsikko: "Kotihoidossa toimiminen"
  },
  {
    osaamisvaatimukset: [],
    osaamispisteet: 15,
    id: 1,
    tila: "valmis",
    sijainnit: ["Projektiryhmä", "Verkko-opiskelu ja lähiopetus"],
    harjoittelujaksot: [
      {
        ajankohta: { alku: "2018-09-01", loppu: "2018-09-15" },
        ohjaaja: "",
        tyotehtavat: []
      }
    ],
    otsikko: "Yrityksessä toimiminen"
  },
  {
    osaamisvaatimukset: [],
    osaamispisteet: 3,
    id: 0,
    tila: "suunniteltu",
    sijainnit: [],
    otsikko: "Kotihoidossa toimiminen"
  },
  {
    osaamisvaatimukset: [],
    osaamispisteet: 6,
    id: 1,
    tila: "suunniteltu",
    sijainnit: [],
    otsikko: "Ikääntyvien osallisuuden edistäminen"
  },
  {
    osaamisvaatimukset: [],
    osaamispisteet: 9,
    id: 2,
    tila: "suunniteltu",
    sijainnit: [],
    otsikko: "Viestintä ja vuorovaikutus suomi toisena kielenä"
  },
  {
    osaamisvaatimukset: [],
    osaamispisteet: 15,
    id: 3,
    tila: "suunniteltu",
    sijainnit: [],
    otsikko: "Yrityksessä toimiminen"
  }
]
