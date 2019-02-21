import { osaamisvaatimukset } from "mocks/mockOsaamisvaatimukset"

export const oppijat = [
  {
    nimi: "Maija Meikäläinen",
    tutkinnonOsa: {
      nimi: "Ikääntyvien osallisuuden edistäminen",
      laajuus: 35
    },
    tutkinto: {
      nimi: "Vanhustyön erikoisammattitutkinto",
      laajuus: 180,
      suunnitelma: "Täydennän osaamistani työelämää varten."
    },
    osaamisenHankkimistapa: {
      ajankohta: {
        alku: "2019-05-23",
        loppu: "2019-06-15"
      },
      tyopaikallaHankittavaOsaaminen: {
        jarjestajanEdustaja: {
          organisaatio: {
            nimi: "Opinpaikka"
          }
        },
        vastuullinenOhjaaja: {
          organisaatio: {
            nimi: "Organisaatio"
          },
          nimi: "Etunimi Sukunimi"
        },
        keskeisetTyotehtavat: [
          "Tehtävä ja kuvaus tehtävän sisällöstä",
          "Tehtävä ja kuvaus tehtävän sisällöstä",
          "Tehtävä ja kuvaus tehtävän sisällöstä"
        ]
      }
    },
    hankitunOsaamisenNaytto: {
      ajankohta: {
        alku: "2018-08-01",
        loppu: "2018-08-01"
      },
      jarjestaja: {
        nimi: "Organisaation nimi"
      },
      nayttoYmparisto: {
        nimi: "Kuvaus näyttöympäristöstä"
      },
      arvioijat: [
        {
          nimi: "Etunimi Sukunimi"
        },
        {
          nimi: "Etunimi Sukunimi"
        },
        {
          nimi: "Etunimi Sukunimi"
        }
      ],
      yksilollisetArviointikriteerit: [
        {
          kuvaus: "Tehtävä ja kuvaus tehtävän sisällöstä"
        },
        {
          kuvaus: "Tehtävä ja kuvaus tehtävän sisällöstä"
        }
      ]
    },
    ammattitaitovaatimukset: [...osaamisvaatimukset]
  },
  {
    nimi: "Ville Meikäläinen",
    tutkinnonOsa: {
      nimi: "Ikääntyvien osallisuuden edistäminen",
      laajuus: 35
    },
    tutkinto: {
      nimi: "Vanhustyön erikoisammattitutkinto",
      laajuus: 180,
      suunnitelma: "Täydennän osaamistani työelämää varten."
    },
    osaamisenHankkimistapa: {
      ajankohta: {
        alku: "2018-06-15",
        loppu: "2019-05-31"
      },
      tyopaikallaHankittavaOsaaminen: {
        jarjestajanEdustaja: {
          organisaatio: {
            nimi: "Koulutuskeskus Oppiva"
          }
        },
        vastuullinenOhjaaja: {
          organisaatio: {
            nimi: "Organisaatio"
          },
          nimi: "Etunimi Sukunimi"
        },
        keskeisetTyotehtavat: [
          "Tehtävä ja kuvaus tehtävän sisällöstä",
          "Tehtävä ja kuvaus tehtävän sisällöstä",
          "Tehtävä ja kuvaus tehtävän sisällöstä"
        ]
      }
    },
    hankitunOsaamisenNaytto: {
      ajankohta: {
        alku: "2018-08-01",
        loppu: "2018-08-01"
      },
      jarjestaja: {
        nimi: "Organisaation nimi"
      },
      nayttoYmparisto: {
        nimi: "Kuvaus näyttöympäristöstä"
      },
      arvioijat: [
        {
          nimi: "Etunimi Sukunimi"
        },
        {
          nimi: "Etunimi Sukunimi"
        },
        {
          nimi: "Etunimi Sukunimi"
        }
      ],
      yksilollisetArviointikriteerit: [
        {
          kuvaus: "Tehtävä ja kuvaus tehtävän sisällöstä"
        },
        {
          kuvaus: "Tehtävä ja kuvaus tehtävän sisällöstä"
        }
      ]
    },
    ammattitaitovaatimukset: [...osaamisvaatimukset]
  },
  {
    nimi: "Viivi Virtanen",
    tutkinnonOsa: {
      nimi: "Vanhustyössä vastuuhenkilönä toimiminen",
      laajuus: 50
    },
    tutkinto: {
      nimi: "Vanhustyön erikoisammattitutkinto",
      laajuus: 180,
      suunnitelma: "Täydennän osaamistani työelämää varten."
    },
    osaamisenHankkimistapa: {
      ajankohta: {
        alku: "",
        loppu: ""
      },
      tyopaikallaHankittavaOsaaminen: {
        jarjestajanEdustaja: {
          organisaatio: {
            nimi: "Opinpaikka"
          }
        },
        vastuullinenOhjaaja: {
          organisaatio: {
            nimi: "Organisaatio"
          },
          nimi: "Etunimi Sukunimi"
        },
        keskeisetTyotehtavat: [
          "Tehtävä ja kuvaus tehtävän sisällöstä",
          "Tehtävä ja kuvaus tehtävän sisällöstä",
          "Tehtävä ja kuvaus tehtävän sisällöstä"
        ]
      }
    },
    hankitunOsaamisenNaytto: {
      ajankohta: {
        alku: "2018-08-01",
        loppu: "2018-08-01"
      },
      jarjestaja: {
        nimi: "Organisaation nimi"
      },
      nayttoYmparisto: {
        nimi: "Kuvaus näyttöympäristöstä"
      },
      arvioijat: [
        {
          nimi: "Etunimi Sukunimi"
        },
        {
          nimi: "Etunimi Sukunimi"
        },
        {
          nimi: "Etunimi Sukunimi"
        }
      ],
      yksilollisetArviointikriteerit: [
        {
          kuvaus: "Tehtävä ja kuvaus tehtävän sisällöstä"
        },
        {
          kuvaus: "Tehtävä ja kuvaus tehtävän sisällöstä"
        }
      ]
    },
    ammattitaitovaatimukset: [...osaamisvaatimukset]
  }
]
