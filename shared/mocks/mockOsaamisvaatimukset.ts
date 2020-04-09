import { Osaamisvaatimus } from "models/Osaamisvaatimus"
import { SnapshotOrInstance } from "mobx-state-tree"

export const osaamisvaatimukset: SnapshotOrInstance<
  typeof Osaamisvaatimus
>[] = [
  {
    kuvaus:
      "työskennellä sosiaali- ja terveysalan työn säädösten, toimintaperiaatteiden, arvojen ja eettisten periaatteiden mukaan",
    kriteerit: [
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
    kriteerit: [
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
    kriteerit: [
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
  },
  {
    kuvaus:
      "käyttää alan työmenetelmiä, -välineitä ja materiaaleja asiakkaan osallisuuden edistämisessä",
    kriteerit: []
  },
  {
    kuvaus:
      "käyttää alan työmenetelmiä, -välineitä ja materiaaleja edistäessään asiakkaan inhimillistä elämää saattohoitovaiheessa",
    kriteerit: []
  },
  {
    kuvaus: "ohjata palveluiden käytössä ja valintojen tekemisessä",
    kriteerit: []
  },
  { kuvaus: "toimia työyhteisön jäsenenä", kriteerit: [] },
  {
    kuvaus:
      "ylläpitää ja edistää turvallisuutta, työkykyään ja työhyvinvointiaan",
    kriteerit: []
  },
  { kuvaus: "arvioida ja kehittää toimintaansa", kriteerit: [] },
  {
    kuvaus: "arvioida mahdollisuuksiaan toimia hyvinvointialan yrittäjänä.",
    kriteerit: []
  }
]
