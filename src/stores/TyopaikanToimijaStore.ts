// import { apiUrl } from "config"
import { flow, getRoot, types } from "mobx-state-tree"
import { Oppija } from "models/Oppija"
import { IRootStore } from "./RootStore"

const ammattitaitovaatimuksetMock = [
  {
    kuvaus:
      "työskennellä sosiaali- ja terveysalan työn säädösten, toimintaperiaatteiden, arvojen ja eettisten periaatteiden mukaan",
    arviointikriteerit: [
      {
        kuvaus: "Tyydyttävä T1",
        kriteerit: [
          "toimii asiakkaan perus- ja ihmisoikeuksia kunnioittaen",
          "noudattaa sosiaali- ja terveysalan säädöksiä, säännöksiä, määräyksiä ja eettisiä periaatteita",
          "noudattaa työskentelyssään tietosuojaa ja salassapitoa",
          "toimii kestävän kehityksen periaatteiden mukaisesti"
        ]
      },
      {
        kuvaus: "Tyydyttävä T2",
        kriteerit: []
      },
      {
        kuvaus: "Hyvä H3",
        kriteerit: [
          "toimii asiakkaan perus- ja ihmisoikeuksia kunnioittaen",
          "noudattaa sosiaali- ja terveysalan säädöksiä, säännöksiä, määräyksiä ja eettisiä periaatteita perustellen toimintaansa",
          "noudattaa työskentelyssään tietosuojaa ja salassapitoa",
          "toimii kestävän kehityksen periaatteiden mukaisesti ja perustelee toimintaansa"
        ]
      },
      {
        kuvaus: "Hyvä H4",
        kriteerit: []
      },
      {
        kuvaus: "Kiitettävä K5",
        kriteerit: [
          "toimii asiakkaan perus- ja ihmisoikeuksia kunnioittaen",
          "noudattaa sosiaali- ja terveysalan säädöksiä, säännöksiä, määräyksiä ja eettisiä periaatteita perustellen monipuolisesti toimintaansa",
          "noudattaa työskentelyssään tietosuojaa ja salassapitoa",
          "toimii kestävän kehityksen periaatteiden mukaisesti, perustelee monipuolisesti toimintaansa ja tekee kehittämisehdotuksia."
        ]
      }
    ]
  },
  {
    kuvaus: "suunnitella, toteuttaa ja arvioida työtään",
    arviointikriteerit: [
      {
        kuvaus: "Tyydyttävä T1",
        kriteerit: [
          "havainnoi ja arvioi asiakkaan toimintakyvyn eri osa-alueita ja tuen tarvetta",
          "huomioi toimintaa suunnitellessaan asiakkaan elämänhistorian, elinympäristön ja elämänlaadun",
          "huomioi työpaikan päivän suunnitelmat toimintaa suunnitellessaan",
          "laatii yhteistyössä asiakkaan kanssa mielekästä arkea tukevan suunnitelman, toteuttaa sitä ja arvioi sen toteutumista",
          "huomioi toiminnassaan kuntoutumista edistävät ja sosiaalisia verkostoja ylläpitävät asiat työryhmän kanssa",
          "toimii moniammatillisen työryhmän ja verkoston jäsenenä noudattaen suunnitelmia ja sopimuksia",
          "raportoi ja kirjaa ymmärrettävästi asiakkaan vointiin ja toimintakykyyn liittyviä havaintoja asiakasturvallisuutta vaarantamatta",
          "käyttää työyhteisön asiakastietojärjestelmiä ja sosiaali- ja terveysalan tietokantoja lähihoitajan vastuualueella"
        ]
      },
      {
        kuvaus: "Tyydyttävä T2",
        kriteerit: []
      },
      {
        kuvaus: "Hyvä H3",
        kriteerit: [
          "havainnoi ja arvioi asiakkaan toimintakyvyn eri osa-alueita ja tuen tarvetta käyttäen apunaan toimintakykymittareita",
          "huomioi toimintaa suunnitellessaan asiakkaan elämänhistorian, elinympäristön ja elämänlaadun tukien asiakkaan omanarvontuntoa",
          "huomioi työpaikan päivä- ja viikkokohtaiset suunnitelmat toimintaa suunnitellessaan",
          "laatii yhteistyössä asiakkaan kanssa mielekästä arkea tukevan suunnitelman huomioiden asiakkaan sosiaaliset verkostot sekä toteuttaa sitä ja arvioi sen toteutumista",
          "huomioi toiminnassaan kuntoutumista edistävät ja sosiaalisia verkostoja ylläpitävät asiat",
          "toimii vastuullisesti moniammatillisen työryhmän ja verkoston jäsenenä noudattaen suunnitelmia ja sopimuksia",
          "raportoi ja kirjaa sujuvasti asiakkaan vointiin ja toimintakykyyn liittyviä havaintoja asiakasturvallisuutta vaarantamatta",
          "käyttää sujuvasti työyhteisön asiakastietojärjestelmiä ja sosiaali- ja terveysalan tietokantoja lähihoitajan vastuualueella"
        ]
      },
      {
        kuvaus: "Hyvä H4",
        kriteerit: []
      },
      {
        kuvaus: "Kiitettävä K5",
        kriteerit: [
          "havainnoi ja arvioi asiakkaan toimintakyvyn eri osa-alueita käyttäen apunaan monipuolisesti erilaisia toimintakykymittareita ja perustelee valintojaan",
          "huomioi toimintaa suunnitellessaan monipuolisesti asiakkaan elämänhistorian, elinympäristön ja elämänlaadun tukien asiakkaan omanarvontuntoa",
          "huomioi työpaikan päivä- ja viikkokohtaiset suunnitelmat toimintaa suunnitellessaan perustellen toimintaansa",
          "laatii yhteistyössä asiakkaan kanssa mielekästä arkea tukevan monipuolisen suunnitelman huomioiden asiakkaan sosiaaliset verkostot sekä toteuttaa sitä ja arvioi sen toteutumista",
          "huomioi monipuolisesti toiminnassaan kuntoutumista ylläpitävät ja edistävät sekä sosiaalisia verkostoja ylläpitävät asiat",
          "toimii aktiivisesti ja vastuullisesti moniammatillisen työryhmän ja verkoston jäsenenä noudattaen suunnitelmia ja sopimuksia",
          "raportoi ja kirjaa aktiivisesti ja monipuolisesti asiakkaan vointiin ja toimintakykyyn liittyviä havaintoja asiakasturvallisuutta vaarantamatta",
          "käyttää monipuolisesti työyhteisön asiakastietojärjestelmiä ja sosiaali- ja terveysalan tietokantoja lähihoitajan vastuualueella."
        ]
      }
    ]
  },
  {
    kuvaus: "toimia vuorovaikutuksessa asiakkaan kanssa",
    arviointikriteerit: [
      {
        kuvaus: "Tyydyttävä T1",
        kriteerit: [
          "kohtaa arvostavasti, kunnioittavasti ja tasavertaisesti asiakkaan",
          "havaitsee asiakkaan vuorovaikutusaloitteita ja vastaa niihin",
          "kuulee asiakkaan ja omaisten mielipiteitä ja huomioi yksilöllisiä toiveita",
          "tukee asiakkaan elämänhallintaa ja vuorovaikutusta käyttäen erilaisia menetelmiä ja toimintamalleja",
          "käyttää selkokieltä mukauttaen tarvittaessa ilmaisuaan",
          "hyödyntää puhetta tukevia ja korvaavia kommunikointikeinoja",
          "toimii ammatillisesti vuorovaikutustilanteissa asiakkaan perheen, tukiverkoston ja omaishoitajan kanssa",
          "palvelee asiakkaita vastuullisesti eri tilanteissa, myös puhelimessa ja sähköisillä viestimillä huomioiden tietoturvan ja salassapidon"
        ]
      },
      {
        kuvaus: "Tyydyttävä T2",
        kriteerit: []
      },
      {
        kuvaus: "Hyvä H3",
        kriteerit: [
          "kohtaa arvostavasti, kunnioittavasti ja tasavertaisesti asiakkaan ja tämän lähiverkoston",
          "havaitsee asiakkaan pienetkin vuorovaikutusaloitteet ja vastaa niihin",
          "kuulee asiakkaan ja omaisten mielipiteitä ja toiveita tukien asiakkaan osallisuutta",
          "tukee asiakkaan elämänhallintaa ja vuorovaikutusta käyttäen erilaisia menetelmiä ja toimintamalleja",
          "käyttää selkokieltä ja mukauttaa ilmaisuaan asiakkaan ja ryhmän kommunikointitaitoja vastaavaksi",
          "käyttää sujuvasti puhetta tukevia ja korvaavia kommunikointikeinoja",
          "toimii ammatillisesti ja yhteistyökykyisesti asiakkaan perheen, tukiverkoston ja omaishoitajan kanssa",
          "palvelee asiakkaita vastuullisesti eri tilanteissa, myös puhelimessa ja sähköisillä viestimillä huomioiden tietoturvan ja salassapidon"
        ]
      },
      {
        kuvaus: "Hyvä H4",
        kriteerit: []
      },
      {
        kuvaus: "Kiitettävä K5",
        kriteerit: [
          "kohtaa arvostavasti, kunnioittavasti ja tasavertaisesti asiakkaan ja tämän lähiverkoston",
          "havaitsee asiakkaan pienetkin vuorovaikutusaloitteet ja vastaa niihin varmistaen asiakkaan ymmärretyksi tulemisen",
          "kuulee asiakkaan ja omaisten mielipiteitä ja toiveita tukien asiakkaan osallisuutta ja elämän merkityksellisyyttä",
          "tukee asiakkaan elämänhallintaa ja vuorovaikutusta käyttäen erilaisia menetelmiä ja toimintamalleja",
          "käyttää luontevasti selkokieltä ja mukauttaa ilmaisuaan asiakkaan ja ryhmän kommunikointitaitoja vastaavaksi rohkaisten asiakasta itsensä ilmaisuun",
          "käyttää tilanteeseen soveltuvia puhetta tukevia ja korvaavia kommunikointikeinoja perustellen valintojaan",
          "toimii ammatillisesti ja aktiivisesti yhteistyössä asiakkaan perheen, tukiverkoston ja omaishoitajan kanssa ja tukee omaishoitajaa työssään",
          "palvelee asiakkaita vastuullisesti eri tilanteissa, myös puhelimessa ja sähköisillä viestimillä huomioiden tietoturvan ja salassapidon."
        ]
      }
    ]
  }
]

const mockData = [
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
    ammattitaitovaatimukset: [...ammattitaitovaatimuksetMock]
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
    ammattitaitovaatimukset: [...ammattitaitovaatimuksetMock]
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
    ammattitaitovaatimukset: [...ammattitaitovaatimuksetMock]
  }
]

const TyopaikanToimijaModel = {
  oppijat: types.array(Oppija),
  isLoading: false
}

export const TyopaikanToimijaStore = types
  .model("TyopaikanToimijaStore", TyopaikanToimijaModel)
  .actions(self => {
    const root = getRoot<IRootStore>(self)

    const haeOppijat = flow(function*(): any {
      self.isLoading = true
      try {
        // TODO: replace with real API call
        // const response = yield root.fetchCollection(apiUrl("oppijat"))
        // self.oppijat.replace(response.data)
        self.oppijat.replace(mockData as any)
      } catch (error) {
        root.errors.logError("TyopaikanToimijaStore.haeOppijat", error.message)
      }
    })

    return { haeOppijat }
  })
