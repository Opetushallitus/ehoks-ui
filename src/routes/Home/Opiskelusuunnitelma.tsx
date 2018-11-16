import { RouteComponentProps } from "@reach/router"
import { Accordion } from "components/Accordion"
import { EmptyItem } from "components/EmptyItem"
import { InfoTable } from "components/InfoTable"
import { StatBox, StatBoxes, StatNumber, StatTitle } from "components/StatBox"
import { StudyInfo } from "components/StudyInfo"
import React from "react"
import { FormattedMessage, intlShape } from "react-intl"
import { Heading } from "routes/Home/Heading"
import { SectionContainer } from "routes/Home/SectionContainer"
import styled from "styled"

// TODO: map real API response after this in Model's views
interface MockStudy {
  id: number
  approved?: string
  assessment?: Array<{
    [key: string]: string[]
  }>
  competenceRequirements?: string[]
  learningPeriods?: Array<{
    approved?: string
    period?: [string, string]
    instructor: string
    assignments: string[]
  }>
  locations?: string[]
  title: string
  competencePoints?: number
  demonstrations?: Array<{
    period: string[]
    organisation: string
    environment: string
    assessors: string[]
    assignments: string[]
  }>
}
const mockPlannedStudies: MockStudy[] = [
  {
    assessment: [
      {
        "Tyydyttävä T1": [
          "toimii asiakkaan perus- ja ihmisoikeuksia kunnioittaen",
          "noudattaa sosiaali- ja terveysalan säädöksiä, säännöksiä, määräyksiä ja eettisiä periaatteita",
          "noudattaa työskentelyssään tietosuojaa ja salassapitoa",
          "toimii kestävän kehityksen periaatteiden mukaisesti"
        ],
        "Tyydyttävä T2": [],
        "Hyvä H3": [
          "toimii asiakkaan perus- ja ihmisoikeuksia kunnioittaen",
          "noudattaa sosiaali- ja terveysalan säädöksiä, säännöksiä, määräyksiä ja eettisiä periaatteita perustellen toimintaansa",
          "noudattaa työskentelyssään tietosuojaa ja salassapitoa",
          "toimii kestävän kehityksen periaatteiden mukaisesti ja perustelee toimintaansa"
        ],
        "Hyvä H4": [],
        "Kiitettävä K5": [
          "toimii asiakkaan perus- ja ihmisoikeuksia kunnioittaen",
          "noudattaa sosiaali- ja terveysalan säädöksiä, säännöksiä, määräyksiä ja eettisiä periaatteita perustellen monipuolisesti toimintaansa",
          "noudattaa työskentelyssään tietosuojaa ja salassapitoa",
          "toimii kestävän kehityksen periaatteiden mukaisesti, perustelee monipuolisesti toimintaansa ja tekee kehittämisehdotuksia."
        ]
      },
      {
        "Tyydyttävä T1": [
          "havainnoi ja arvioi asiakkaan toimintakyvyn eri osa-alueita ja tuen tarvetta",
          "huomioi toimintaa suunnitellessaan asiakkaan elämänhistorian, elinympäristön ja elämänlaadun",
          "huomioi työpaikan päivän suunnitelmat toimintaa suunnitellessaan",
          "laatii yhteistyössä asiakkaan kanssa mielekästä arkea tukevan suunnitelman, toteuttaa sitä ja arvioi sen toteutumista",
          "huomioi toiminnassaan kuntoutumista edistävät ja sosiaalisia verkostoja ylläpitävät asiat työryhmän kanssa",
          "toimii moniammatillisen työryhmän ja verkoston jäsenenä noudattaen suunnitelmia ja sopimuksia",
          "raportoi ja kirjaa ymmärrettävästi asiakkaan vointiin ja toimintakykyyn liittyviä havaintoja asiakasturvallisuutta vaarantamatta",
          "käyttää työyhteisön asiakastietojärjestelmiä ja sosiaali- ja terveysalan tietokantoja lähihoitajan vastuualueella"
        ],
        "Tyydyttävä T2": [],
        "Hyvä H3": [
          "havainnoi ja arvioi asiakkaan toimintakyvyn eri osa-alueita ja tuen tarvetta käyttäen apunaan toimintakykymittareita",
          "huomioi toimintaa suunnitellessaan asiakkaan elämänhistorian, elinympäristön ja elämänlaadun tukien asiakkaan omanarvontuntoa",
          "huomioi työpaikan päivä- ja viikkokohtaiset suunnitelmat toimintaa suunnitellessaan",
          "laatii yhteistyössä asiakkaan kanssa mielekästä arkea tukevan suunnitelman huomioiden asiakkaan sosiaaliset verkostot sekä toteuttaa sitä ja arvioi sen toteutumista",
          "huomioi toiminnassaan kuntoutumista edistävät ja sosiaalisia verkostoja ylläpitävät asiat",
          "toimii vastuullisesti moniammatillisen työryhmän ja verkoston jäsenenä noudattaen suunnitelmia ja sopimuksia",
          "raportoi ja kirjaa sujuvasti asiakkaan vointiin ja toimintakykyyn liittyviä havaintoja asiakasturvallisuutta vaarantamatta",
          "käyttää sujuvasti työyhteisön asiakastietojärjestelmiä ja sosiaali- ja terveysalan tietokantoja lähihoitajan vastuualueella"
        ],
        "Hyvä H4": [],
        "Kiitettävä K5": [
          "havainnoi ja arvioi asiakkaan toimintakyvyn eri osa-alueita käyttäen apunaan monipuolisesti erilaisia toimintakykymittareita ja perustelee valintojaan",
          "huomioi toimintaa suunnitellessaan monipuolisesti asiakkaan elämänhistorian, elinympäristön ja elämänlaadun tukien asiakkaan omanarvontuntoa",
          "huomioi työpaikan päivä- ja viikkokohtaiset suunnitelmat toimintaa suunnitellessaan perustellen toimintaansa",
          "laatii yhteistyössä asiakkaan kanssa mielekästä arkea tukevan monipuolisen suunnitelman huomioiden asiakkaan sosiaaliset verkostot sekä toteuttaa sitä ja arvioi sen toteutumista",
          "huomioi monipuolisesti toiminnassaan kuntoutumista ylläpitävät ja edistävät sekä sosiaalisia verkostoja ylläpitävät asiat",
          "toimii aktiivisesti ja vastuullisesti moniammatillisen työryhmän ja verkoston jäsenenä noudattaen suunnitelmia ja sopimuksia",
          "raportoi ja kirjaa aktiivisesti ja monipuolisesti asiakkaan vointiin ja toimintakykyyn liittyviä havaintoja asiakasturvallisuutta vaarantamatta",
          "käyttää monipuolisesti työyhteisön asiakastietojärjestelmiä ja sosiaali- ja terveysalan tietokantoja lähihoitajan vastuualueella."
        ]
      },
      {
        "Tyydyttävä T1": [
          "kohtaa arvostavasti, kunnioittavasti ja tasavertaisesti asiakkaan",
          "havaitsee asiakkaan vuorovaikutusaloitteita ja vastaa niihin",
          "kuulee asiakkaan ja omaisten mielipiteitä ja huomioi yksilöllisiä toiveita",
          "tukee asiakkaan elämänhallintaa ja vuorovaikutusta käyttäen erilaisia menetelmiä ja toimintamalleja",
          "käyttää selkokieltä mukauttaen tarvittaessa ilmaisuaan",
          "hyödyntää puhetta tukevia ja korvaavia kommunikointikeinoja",
          "toimii ammatillisesti vuorovaikutustilanteissa asiakkaan perheen, tukiverkoston ja omaishoitajan kanssa",
          "palvelee asiakkaita vastuullisesti eri tilanteissa, myös puhelimessa ja sähköisillä viestimillä huomioiden tietoturvan ja salassapidon"
        ],
        "Tyydyttävä T2": [],
        "Hyvä H3": [
          "kohtaa arvostavasti, kunnioittavasti ja tasavertaisesti asiakkaan ja tämän lähiverkoston",
          "havaitsee asiakkaan pienetkin vuorovaikutusaloitteet ja vastaa niihin",
          "kuulee asiakkaan ja omaisten mielipiteitä ja toiveita tukien asiakkaan osallisuutta",
          "tukee asiakkaan elämänhallintaa ja vuorovaikutusta käyttäen erilaisia menetelmiä ja toimintamalleja",
          "käyttää selkokieltä ja mukauttaa ilmaisuaan asiakkaan ja ryhmän kommunikointitaitoja vastaavaksi",
          "käyttää sujuvasti puhetta tukevia ja korvaavia kommunikointikeinoja",
          "toimii ammatillisesti ja yhteistyökykyisesti asiakkaan perheen, tukiverkoston ja omaishoitajan kanssa",
          "palvelee asiakkaita vastuullisesti eri tilanteissa, myös puhelimessa ja sähköisillä viestimillä huomioiden tietoturvan ja salassapidon"
        ],
        "Hyvä H4": [],
        "Kiitettävä K5": [
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
    ],
    competenceRequirements: [
      "työskennellä sosiaali- ja terveysalan työn säädösten, toimintaperiaatteiden, arvojen ja eettisten periaatteiden mukaan",
      "suunnitella, toteuttaa ja arvioida työtään",
      "toimia vuorovaikutuksessa asiakkaan kanssa",
      "käyttää alan työmenetelmiä, -välineitä ja materiaaleja asiakkaan osallisuuden edistämisessä",
      "käyttää alan työmenetelmiä, -välineitä ja materiaaleja edistäessään asiakkaan inhimillistä elämää saattohoitovaiheessa",
      "ohjata palveluiden käytössä ja valintojen tekemisessä",
      "toimia työyhteisön jäsenenä",
      "ylläpitää ja edistää turvallisuutta, työkykyään ja työhyvinvointiaan",
      "arvioida ja kehittää toimintaansa",
      "arvioida mahdollisuuksiaan toimia hyvinvointialan yrittäjänä."
    ],
    competencePoints: 35,
    id: 0,
    locations: ["Opinpaikka", "Lähiopetus"],
    learningPeriods: [
      {
        period: ["2018-05-24", "2018-05-31"],
        instructor: "Etunimi Sukunimi, Organisaatio",
        assignments: [
          "Ensimmäinen tehtävä ja kuvaus tehtävän sisällöstä",
          "Toinen tehtävä ja kuvaus tehtävän sisällöstä",
          "Kolmas tehtävä ja kuvaus tehtävän sisällöstä",
          "Neljäs tehtävä ja kuvaus tehtävän sisällöstä"
        ]
      }
    ],
    demonstrations: [
      {
        period: ["2018-08-01"],
        organisation: "Organisaation nimi",
        environment: "Kuvaus näyttöympäristöstä",
        assessors: ["Etunimi Sukunimi", "Etunimi Sukunimi", "Etunimi Sukunimi"],
        assignments: [
          "Tehtävä ja kuvaus tehtävän sisällöstä",
          "Tehtävä ja kuvaus tehtävän sisällöstä"
        ]
      }
    ],
    title: "Ikääntyvien osallisuuden edistäminen"
  },
  {
    assessment: [],
    competenceRequirements: [],
    competencePoints: 4,
    id: 1,
    learningPeriods: [
      {
        approved: "2018-04-01",
        instructor: "Etunimi Sukunimi, Organisaatio",
        assignments: [
          "Tehtävä ja kuvaus tehtävän sisällöstä",
          "Tehtävä ja kuvaus tehtävän sisällöstä",
          "Tehtävä ja kuvaus tehtävän sisällöstä",
          "Tehtävä ja kuvaus tehtävän sisällöstä"
        ]
      }
    ],
    locations: ["Tavastia", "Muualla suoritettu"],
    title: "Viestintä ja vuorovaikutus suomi toisena kielenä"
  }
]
const mockCompletedStudies: MockStudy[] = [
  {
    assessment: [],
    competenceRequirements: [],
    competencePoints: 40,
    id: 0,
    locations: ["Palvelutalo Villilän niemi", "Työpaikalla oppiminen"],
    learningPeriods: [
      {
        period: ["2018-03-01", "2018-05-31"],
        instructor: "",
        assignments: []
      }
    ],
    title: "Kotihoidossa toimiminen"
  },
  {
    assessment: [],
    competenceRequirements: [],
    competencePoints: 30,
    id: 1,
    locations: ["Opinpaikka", "Lähiopetus"],
    learningPeriods: [
      {
        period: ["2018-05-24", "2018-05-31"],
        instructor: "",
        assignments: []
      }
    ],
    title: "Ikääntyvien osallisuuden edistäminen"
  },
  {
    assessment: [],
    competenceRequirements: [],
    competencePoints: 4,
    id: 2,
    locations: ["Tavastia", "Muualla suoritettu"],
    learningPeriods: [
      {
        approved: "2018-04-01",
        instructor: "",
        assignments: []
      }
    ],
    title: "Viestintä ja vuorovaikutus suomi toisena kielenä"
  },
  {
    assessment: [],
    competenceRequirements: [],
    competencePoints: 15,
    id: 3,
    locations: ["Projektiryhmä", "Verkko-opiskelu ja lähiopetus"],
    learningPeriods: [
      {
        period: ["2018-09-01", "2018-09-15"],
        instructor: "",
        assignments: []
      }
    ],
    title: "Yrityksessä toimiminen"
  }
]
const mockUnscheduledStudies: MockStudy[] = [
  {
    assessment: [],
    competenceRequirements: [],
    competencePoints: 3,
    id: 0,
    locations: [],
    title: "Kotihoidossa toimiminen"
  },
  {
    assessment: [],
    competenceRequirements: [],
    competencePoints: 6,
    id: 1,
    locations: [],
    title: "Ikääntyvien osallisuuden edistäminen"
  },
  {
    assessment: [],
    competenceRequirements: [],
    competencePoints: 9,
    id: 2,
    locations: [],
    title: "Viestintä ja vuorovaikutus suomi toisena kielenä"
  },
  {
    assessment: [],
    competenceRequirements: [],
    competencePoints: 15,
    id: 3,
    locations: [],
    title: "Yrityksessä toimiminen"
  },
  {
    assessment: [],
    competenceRequirements: [],
    competencePoints: 15,
    id: 4,
    locations: [],
    title: "Viestintä ja vuorovaikutus suomi toisena kielenä"
  },
  {
    assessment: [],
    competenceRequirements: [],
    competencePoints: 35,
    id: 5,
    locations: [],
    title: "Yrityksessä toimiminen"
  }
]

const FlexFiller = styled("div")`
  flex: 1;
`

const Studies = styled("div")`
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;

  @media screen and (max-width: 1060px) {
    flex-direction: column;
  }
`

export interface OpiskelusuunnitelmaProps {
  children?: React.ReactChildren
}

export interface OpiskelusuunnitelmaState {
  activeAccordions: {
    [accordionName: string]: boolean | { [subAccordionName: string]: boolean }
  }
}

export class Opiskelusuunnitelma extends React.Component<
  OpiskelusuunnitelmaProps & RouteComponentProps,
  OpiskelusuunnitelmaState
> {
  static contextTypes = {
    intl: intlShape
  }
  state = {
    activeAccordions: {
      // suunnitelma: false,
      suunnitelma: true,
      suunnitelmat: {
        // aikatauluttomat: false,
        aikatauluttomat: true,
        suunnitellut: true,
        valmiit: false
      },
      tavoitteet: true,
      tukevatOpinnot: false
    }
  }

  componentDidMount() {
    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
  }

  toggleAccordion = (accordion: string, subAccordion?: string) => () => {
    this.setState(state => ({
      ...state,
      activeAccordions: {
        ...state.activeAccordions,
        [accordion]: !subAccordion
          ? !state.activeAccordions[accordion]
          : this.toggleSubAccordion(
              state.activeAccordions[accordion],
              subAccordion
            )
      }
    }))
  }

  toggleSubAccordion = (
    accordion: boolean | { [subAccordionName: string]: boolean },
    subAccordion: string
  ) => {
    // no-op if accordion with sub-accordion has been accidentally initalized as boolean
    if (typeof accordion === "boolean") {
      return accordion
    } else {
      return {
        ...accordion,
        [subAccordion]: !accordion[subAccordion]
      }
    }
  }

  render() {
    const { intl } = this.context
    const { activeAccordions } = this.state
    const competencePointsTitle = intl.formatMessage({
      id: "opiskelusuunnitelma.osaamispisteLyhenne"
    })

    return (
      <SectionContainer>
        <Heading>
          <FormattedMessage
            id="opiskelusuunnitelma.title"
            defaultMessage="Opiskelusuunnitelmani"
          />
        </Heading>

        <Accordion
          id="tavoitteet"
          open={activeAccordions.tavoitteet}
          title={
            <FormattedMessage
              id="opiskelusuunnitelma.tavoitteetTitle"
              defaultMessage="Tavoitteeni ja opintojen eteneminen"
            />
          }
          onToggle={this.toggleAccordion("tavoitteet")}
          helpIcon={true}
          helpContent={"Testi"}
        >
          <InfoTable>
            <tbody>
              <tr>
                <th>
                  <FormattedMessage
                    id="opiskelusuunnitelma.tutkinnonNimiTitle"
                    defaultMessage="Tutkinnon nimi"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="opiskelusuunnitelma.laajuusTitle"
                    defaultMessage="Laajuus"
                  />
                </th>
                <th />
              </tr>
              <tr>
                <td
                  data-label={intl.formatMessage({
                    id: "opiskelusuunnitelma.tutkinnonNimiTitle"
                  })}
                >
                  Sosiaali- ja terveysalan perustutkinnon perusteet
                </td>
                <td
                  data-label={intl.formatMessage({
                    id: "opiskelusuunnitelma.laajuusTitle"
                  })}
                >
                  180 osaamispistettä
                </td>
                <td />
              </tr>
              <tr>
                <th>
                  <FormattedMessage
                    id="opiskelusuunnitelma.osaamisalaTitle"
                    defaultMessage="Osaamisala"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="opiskelusuunnitelma.tutkintonimikeTitle"
                    defaultMessage="Tutkintonimike"
                  />
                </th>
                <th />
              </tr>
              <tr>
                <td
                  data-label={intl.formatMessage({
                    id: "opiskelusuunnitelma.osaamisalaTitle"
                  })}
                >
                  Ikääntyvien hoidon ja kuntoutumisen osaamisala
                </td>
                <td
                  data-label={intl.formatMessage({
                    id: "opiskelusuunnitelma.tutkintonimikeTitle"
                  })}
                >
                  Lähihoitaja
                </td>
                <td />
              </tr>
            </tbody>
          </InfoTable>
          <StatBoxes>
            <StatBox borderTop="#EB6F02">
              <StatNumber color="#EB6F02">2</StatNumber>
              <StatTitle>
                <FormattedMessage
                  id="opiskelusuunnitelma.suunniteltuaOpintoaTitle"
                  defaultMessage="Suunniteltua opintoa"
                />
              </StatTitle>
            </StatBox>
            <StatBox borderTop="#43A047">
              <StatNumber color="#43A047">4</StatNumber>
              <StatTitle>
                <FormattedMessage
                  id="opiskelusuunnitelma.valmistaOpintoaTitle"
                  defaultMessage="Valmista opintoa"
                />
              </StatTitle>
            </StatBox>
            <StatBox borderTop="#E2A626">
              <StatNumber color="#E2A626">6</StatNumber>
              <StatTitle>
                <FormattedMessage
                  id="opiskelusuunnitelma.aikatauluttamatontaOpintoa"
                  defaultMessage="Aikatauluttamatonta opintoa"
                />
              </StatTitle>
            </StatBox>
            <FlexFiller />
          </StatBoxes>
        </Accordion>

        <Accordion
          id="suunnitelma"
          open={activeAccordions.suunnitelma}
          title={
            <FormattedMessage
              id="opiskelusuunnitelma.suunnitelmaTutkinnonosittainTitle"
              defaultMessage="Suunnitelma tutkinnonosittain"
            />
          }
          onToggle={this.toggleAccordion("suunnitelma")}
          helpIcon={true}
          helpContent="Testiaputeksti"
          childContainer={false}
        >
          <Accordion
            id="suunnitelma.suunnitellut"
            open={activeAccordions.suunnitelmat.suunnitellut}
            onToggle={this.toggleAccordion("suunnitelmat", "suunnitellut")}
            title={
              <FormattedMessage
                id="opiskelusuunnitelma.aikataulutetutOpintoniTitle"
                defaultMessage="Aikataulutetut opintoni ({amount})"
                values={{ amount: mockPlannedStudies.length }}
              />
            }
            inline={true}
            childContainer={false}
          >
            <Studies>
              {mockPlannedStudies.map((study, i) => {
                const renderExtraItem = (i + 1) % 4 === 0
                return (
                  <React.Fragment key={study.id}>
                    <StudyInfo
                      accentColor="#EB6F02"
                      fadedColor="#FDF1E6"
                      title={`${study.title} ${
                        study.competencePoints
                      } ${competencePointsTitle}`}
                      locations={study.locations}
                      learningPeriods={study.learningPeriods}
                      competenceRequirements={study.competenceRequirements}
                      assessment={study.assessment}
                      demonstrations={study.demonstrations}
                    />
                    {renderExtraItem && <EmptyItem />}
                  </React.Fragment>
                )
              })}
              {!mockPlannedStudies.length && (
                <div>
                  <FormattedMessage
                    id="opiskelusuunnitelma.eiAikataulutettujaOpintojaTitle"
                    defaultMessage="Ei aikataulutettuja opintoja"
                  />
                  .
                </div>
              )}
            </Studies>
          </Accordion>

          <Accordion
            id="suunnitelma.valmiit"
            open={activeAccordions.suunnitelmat.valmiit}
            onToggle={this.toggleAccordion("suunnitelmat", "valmiit")}
            title={
              <FormattedMessage
                id="opiskelusuunnitelma.valmiitOpintoniTitle"
                defaultMessage="Valmiit opintoni ({amount})"
                values={{ amount: mockCompletedStudies.length }}
              />
            }
            inline={true}
            childContainer={false}
          >
            <Studies>
              {mockCompletedStudies.map((study, i) => {
                const renderExtraItem = (i + 1) % 4 === 0
                return (
                  <React.Fragment key={study.id}>
                    <StudyInfo
                      accentColor="#43A047"
                      fadedColor="#ECF6ED"
                      title={`${study.title} ${
                        study.competencePoints
                      } ${competencePointsTitle}`}
                      locations={study.locations}
                      learningPeriods={study.learningPeriods}
                      competenceRequirements={study.competenceRequirements}
                      assessment={study.assessment}
                      demonstrations={study.demonstrations}
                    />
                    {renderExtraItem && <EmptyItem />}
                  </React.Fragment>
                )
              })}
              {!mockCompletedStudies.length && (
                <div>
                  <FormattedMessage
                    id="opiskelusuunnitelma.eiValmiitaOpintojaTitle"
                    defaultMessage="Ei valmiita opintoja"
                  />
                  .
                </div>
              )}
            </Studies>
          </Accordion>

          <Accordion
            id="suunnitelma.aikatauluttomat"
            open={activeAccordions.suunnitelmat.aikatauluttomat}
            onToggle={this.toggleAccordion("suunnitelmat", "aikatauluttomat")}
            title={
              <FormattedMessage
                id="opiskelusuunnitelma.suunnitellutOpintoniTitle"
                defaultMessage="Suunnitellut opintoni ({amount})"
                values={{ amount: mockUnscheduledStudies.length }}
              />
            }
            inline={true}
            childContainer={false}
          >
            <Studies>
              {mockUnscheduledStudies.map((study, i) => {
                const renderExtraItem = (i + 1) % 4 === 0
                return (
                  <React.Fragment key={study.id}>
                    <StudyInfo
                      accentColor="#E2A626"
                      fadedColor="#FDF6E9"
                      title={`${study.title} ${
                        study.competencePoints
                      } ${competencePointsTitle}`}
                      locations={study.locations}
                      learningPeriods={study.learningPeriods}
                      competenceRequirements={study.competenceRequirements}
                      assessment={study.assessment}
                      demonstrations={study.demonstrations}
                    />
                    {renderExtraItem && <EmptyItem />}
                  </React.Fragment>
                )
              })}
              {!mockUnscheduledStudies.length && (
                <div>
                  <FormattedMessage
                    id="opiskelusuunnitelma.eiSuunniteltujaOpintojaTitle"
                    defaultMessage="Ei suunniteltuja opintoja"
                  />
                  .
                </div>
              )}
            </Studies>
          </Accordion>
        </Accordion>

        <Accordion
          id="tukevatOpinnot"
          open={activeAccordions.tukevatOpinnot}
          title={
            <FormattedMessage
              id="opiskelusuunnitelma.opiskeluvalmiuksiaTukevatOpinnotTitle"
              defaultMessage="Opiskeluvalmiuksia tukevat opinnot"
            />
          }
          onToggle={this.toggleAccordion("tukevatOpinnot")}
          helpIcon={true}
        >
          opiskeluvalmiuksia tukevat opinnot
        </Accordion>
      </SectionContainer>
    )
  }
}
