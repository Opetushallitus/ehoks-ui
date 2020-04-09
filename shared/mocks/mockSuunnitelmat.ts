import { SnapshotOrInstance } from "mobx-state-tree"
import { HOKS } from "models/HOKS"

export const suunnitelmat: SnapshotOrInstance<typeof HOKS>[] = [
  {
    eid: "123",
    opiskeluoikeusOid: "1.2.246.562.15.76811932037",
    oppijaOid: "1.2.246.562.24.44651722625",
    urasuunnitelmaKoodiUri: "urasuunnitelma_0003",
    ensikertainenHyvaksyminen: "2019-01-01",
    puuttuvatAmmatillisetTutkinnonOsat: [
      {
        tutkinnonOsaKoodiUri: "tutkinnonosat_106228",
        osaamisenHankkimistavat: [
          {
            alku: "2019-05-23",
            loppu: "2019-06-15",
            tyopaikallaHankittavaOsaaminen: {
              tyopaikanNimi: "Opinpaikka",
              vastuullinenOhjaaja: {
                nimi: "Etunimi Sukunimi"
              },
              keskeisetTyotehtavat: ["Ensimmäinen tehtävä", "Toinen tehtävä"]
            }
          }
        ],
        hankitunOsaamisenNaytto: [
          {
            alku: "2019-08-01",
            loppu: "2019-08-01",
            nayttoymparisto: {
              nimi: "Organisaation nimi",
              kuvaus: "Kuvaus näyttöympäristöstä"
            },
            koulutuksenJarjestajaArvioijat: [
              {
                nimi: "Kimmo Kouluttaja",
                organisaatio: {
                  oppilaitosOid: "123"
                }
              }
            ],
            tyoelamaArvioijat: [
              {
                nimi: "Tiina Työelämäinen",
                organisaatio: {
                  nimi: "Organisaation nimi"
                }
              }
            ],
            keskeisetTyotehtavatNaytto: [
              "Ensimmäinen näyttötehtävä",
              "Toinen näyttötehtävä"
            ]
          }
        ]
      }
    ]
  },
  {
    eid: "456",
    opiskeluoikeusOid: "1.2.246.562.15.76811932037",
    oppijaOid: "1.2.246.562.24.44651722625",
    urasuunnitelmaKoodiUri: "urasuunnitelma_0001",
    ensikertainenHyvaksyminen: "2019-01-01",
    puuttuvatAmmatillisetTutkinnonOsat: [
      {
        tutkinnonOsaKoodiUri: "tutkinnonosat_106228",
        osaamisenHankkimistavat: [
          {
            alku: "2019-06-15",
            loppu: "2019-06-30",
            tyopaikallaHankittavaOsaaminen: {
              tyopaikanNimi: "Koulutuskeskus Oppiva",
              vastuullinenOhjaaja: {
                nimi: "Etunimi Sukunimi"
              },
              keskeisetTyotehtavat: ["Ensimmäinen tehtävä", "Toinen tehtävä"]
            }
          }
        ],
        hankitunOsaamisenNaytto: [
          {
            alku: "2019-08-01",
            loppu: "2019-08-01",
            nayttoymparisto: {
              nimi: "Organisaation nimi",
              kuvaus: "Kuvaus näyttöympäristöstä"
            },
            koulutuksenJarjestajaArvioijat: [
              {
                nimi: "Kimmo Kouluttaja",
                organisaatio: {
                  oppilaitosOid: "123"
                }
              }
            ],
            tyoelamaArvioijat: [
              {
                nimi: "Tiina Työelämäinen",
                organisaatio: {
                  nimi: "Organisaation nimi"
                }
              }
            ],
            keskeisetTyotehtavatNaytto: [
              "Ensimmäinen näyttötehtävä",
              "Toinen näyttötehtävä"
            ]
          }
        ]
      }
    ]
  },
  {
    eid: "789",
    opiskeluoikeusOid: "1.2.246.562.15.76811932037",
    oppijaOid: "1.2.246.562.24.44651722625",
    urasuunnitelmaKoodiUri: "urasuunnitelma_0002",
    ensikertainenHyvaksyminen: "2019-01-01",
    puuttuvatAmmatillisetTutkinnonOsat: [
      {
        tutkinnonOsaKoodiUri: "tutkinnonosat_300204",
        osaamisenHankkimistavat: [
          {
            alku: "",
            loppu: "",
            tyopaikallaHankittavaOsaaminen: {
              tyopaikanNimi: "Opinpaikka",
              vastuullinenOhjaaja: {
                nimi: "Etunimi Sukunimi"
              },
              keskeisetTyotehtavat: ["Ensimmäinen tehtävä", "Toinen tehtävä"]
            }
          }
        ],
        hankitunOsaamisenNaytto: [
          {
            alku: "2019-09-11",
            loppu: "2019-09-11",
            nayttoymparisto: {
              nimi: "Organisaation nimi",
              kuvaus: "Kuvaus näyttöympäristöstä"
            },
            koulutuksenJarjestajaArvioijat: [
              {
                nimi: "Kimmo Kouluttaja",
                organisaatio: {
                  oppilaitosOid: "123"
                }
              }
            ],
            tyoelamaArvioijat: [
              {
                nimi: "Tiina Työelämäinen",
                organisaatio: {
                  nimi: "Organisaation nimi"
                }
              }
            ],
            keskeisetTyotehtavatNaytto: [
              "Ensimmäinen näyttötehtävä",
              "Toinen näyttötehtävä"
            ]
          }
        ]
      }
    ]
  }
]
