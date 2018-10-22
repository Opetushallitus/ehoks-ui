import { RouteComponentProps } from "@reach/router"
import { Accordion } from "components/Accordion"
import { EmptyItem } from "components/EmptyItem"
import { InfoTable } from "components/InfoTable"
import { StatBox, StatBoxes, StatNumber, StatTitle } from "components/StatBox"
import { StudyInfo } from "components/StudyInfo"
import React from "react"
import styled from "react-emotion"
import { FormattedMessage, intlShape } from "react-intl"
import { Heading } from "routes/Home/Heading"
import { SectionContainer } from "routes/Home/SectionContainer"

// TODO: map real API response after this in Model's views
interface MockStudy {
  id: number
  approved?: Date
  assessment?: Array<{
    [key: string]: string[]
  }>
  competenceRequirements?: string[]
  learningEnvironments?: string[]
  period?: Date[]
  title: string
  competencePoints?: number
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
    learningEnvironments: ["Opinpaikka", "Lähiopetus"],
    period: [new Date("2018.05.24"), new Date("2018.05.31")],
    title: "Ikääntyvien osallisuuden edistäminen"
  },
  {
    approved: new Date("2018.04.01"),
    assessment: [],
    competenceRequirements: [],
    competencePoints: 4,
    id: 1,
    learningEnvironments: ["Tavastia", "Muualla suoritettu"],
    period: [],
    title: "Viestintä ja vuorovaikutus suomi toisena kielenä"
  }
]
const mockCompletedStudies: MockStudy[] = [
  {
    assessment: [],
    competenceRequirements: [],
    competencePoints: 40,
    id: 0,
    learningEnvironments: [
      "Palvelutalo Villilän niemi",
      "Työpaikalla oppiminen"
    ],
    period: [new Date("2018.03.01"), new Date("2018.05.31")],
    title: "Kotihoidossa toimiminen"
  },
  {
    assessment: [],
    competenceRequirements: [],
    competencePoints: 30,
    id: 1,
    learningEnvironments: ["Opinpaikka", "Lähiopetus"],
    period: [new Date("2018.05.24"), new Date("2018.05.31")],
    title: "Ikääntyvien osallisuuden edistäminen"
  },
  {
    approved: new Date("2018.04.01"),
    assessment: [],
    competenceRequirements: [],
    competencePoints: 4,
    id: 2,
    learningEnvironments: ["Tavastia", "Muualla suoritettu"],
    period: [],
    title: "Viestintä ja vuorovaikutus suomi toisena kielenä"
  },
  {
    assessment: [],
    competenceRequirements: [],
    competencePoints: 15,
    id: 3,
    learningEnvironments: ["Projektiryhmä", "Verkko-opiskelu ja lähiopetus"],
    period: [new Date("2018.09.01"), new Date("2018.09.15")],
    title: "Yrityksessä toimiminen"
  }
]
const mockUnscheduledStudies: MockStudy[] = [
  {
    assessment: [],
    competenceRequirements: [],
    competencePoints: 3,
    id: 0,
    learningEnvironments: [],
    period: [],
    title: "Kotihoidossa toimiminen"
  },
  {
    assessment: [],
    competenceRequirements: [],
    competencePoints: 6,
    id: 1,
    learningEnvironments: [],
    period: [],
    title: "Ikääntyvien osallisuuden edistäminen"
  },
  {
    assessment: [],
    competenceRequirements: [],
    competencePoints: 9,
    id: 2,
    learningEnvironments: [],
    period: [],
    title: "Viestintä ja vuorovaikutus suomi toisena kielenä"
  },
  {
    assessment: [],
    competenceRequirements: [],
    competencePoints: 15,
    id: 3,
    learningEnvironments: [],
    period: [],
    title: "Yrityksessä toimiminen"
  },
  {
    assessment: [],
    competenceRequirements: [],
    competencePoints: 15,
    id: 4,
    learningEnvironments: [],
    period: [],
    title: "Viestintä ja vuorovaikutus suomi toisena kielenä"
  },
  {
    assessment: [],
    competenceRequirements: [],
    competencePoints: 35,
    id: 5,
    learningEnvironments: [],
    period: [],
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

export interface OpintosuunnitelmaProps {
  children?: React.ReactChildren
}

export interface OpintosuunnitelmaState {
  activeAccordions: {
    [accordionName: string]: boolean | { [subAccordionName: string]: boolean }
  }
}

export class Opintosuunnitelma extends React.Component<
  OpintosuunnitelmaProps & RouteComponentProps,
  OpintosuunnitelmaState
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
  toggleAccordion = (accordion: string, subAccordion?: string) => () => {
    this.setState(state => ({
      ...state,
      activeAccordions: {
        ...state.activeAccordions,
        [accordion]:
          typeof state.activeAccordions[accordion] === "boolean"
            ? !state.activeAccordions[accordion]
            : {
                ...(state.activeAccordions[accordion] as {
                  [subAccordionName: string]: boolean
                }),
                [subAccordion]: !(state.activeAccordions[accordion] as {
                  [subAccordionName: string]: boolean
                })[subAccordion]
              }
      }
    }))
  }

  render() {
    const { intl } = this.context
    const { activeAccordions } = this.state
    const competencePointsTitle = intl.formatMessage({
      defaultMessage: "osp",
      id: "opintosuunnitelma.competencePointsAbbreviation"
    })

    return (
      <SectionContainer>
        <Heading>
          <FormattedMessage
            id="opintosuunnitelma.title"
            defaultMessage="Opiskelusuunnitelmani"
          />
        </Heading>

        <Accordion
          open={activeAccordions.tavoitteet}
          title={
            <FormattedMessage
              id="opintosuunnitelma.goalsAndProgress"
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
                    id="opintosuunnitelma.qualificationName"
                    defaultMessage="Tutkinnon nimi"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="opintosuunnitelma.scope"
                    defaultMessage="Laajuus"
                  />
                </th>
                <th />
              </tr>
              <tr>
                <td
                  data-label={intl.formatMessage({
                    defaultMessage: "Tutkinnon nimi",
                    id: "opintosuunnitelma.qualificationName"
                  })}
                >
                  Sosiaali- ja terveysalan perustutkinnon perusteet
                </td>
                <td
                  data-label={intl.formatMessage({
                    defaultMessage: "Laajuus",
                    id: "opintosuunnitelma.scope"
                  })}
                >
                  180 osaamispistettä
                </td>
                <td />
              </tr>
              <tr>
                <th>
                  <FormattedMessage
                    id="opintosuunnitelma.competenceArea"
                    defaultMessage="Osaamisala"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="opintosuunnitelma.qualificationTitle"
                    defaultMessage="Tutkintonimike"
                  />
                </th>
                <th />
              </tr>
              <tr>
                <td
                  data-label={intl.formatMessage({
                    defaultMessage: "Osaamisala",
                    id: "opintosuunnitelma.competenceArea"
                  })}
                >
                  Ikääntyvien hoidon ja kuntoutumisen osaamisala
                </td>
                <td
                  data-label={intl.formatMessage({
                    defaultMessage: "Tutkintonimike",
                    id: "opintosuunnitelma.qualificationTitle"
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
                  id="opintosuunnitelma.plannedStudies"
                  defaultMessage="Suunniteltua opintoa"
                />
              </StatTitle>
            </StatBox>
            <StatBox borderTop="#43A047">
              <StatNumber color="#43A047">4</StatNumber>
              <StatTitle>
                <FormattedMessage
                  id="opintosuunnitelma.completedStudies"
                  defaultMessage="Valmista opintoa"
                />
              </StatTitle>
            </StatBox>
            <StatBox borderTop="#E2A626">
              <StatNumber color="#E2A626">6</StatNumber>
              <StatTitle>
                <FormattedMessage
                  id="opintosuunnitelma.unscheduledStudies"
                  defaultMessage="Aikatauluttamatonta opintoa"
                />
              </StatTitle>
            </StatBox>
            <FlexFiller />
          </StatBoxes>
        </Accordion>

        <Accordion
          open={activeAccordions.suunnitelma}
          title={
            <FormattedMessage
              id="opintosuunnitelma.plan"
              defaultMessage="Suunnitelma tutkinnonosittain"
            />
          }
          onToggle={this.toggleAccordion("suunnitelma")}
          helpIcon={true}
          helpContent="Testiaputeksti"
          childContainer={false}
        >
          <Accordion
            open={activeAccordions.suunnitelmat.suunnitellut}
            onToggle={this.toggleAccordion("suunnitelmat", "suunnitellut")}
            title={
              <FormattedMessage
                id="opintosuunnitelma.plannedStudiesTitle"
                defaultMessage="Suunnitellut opintoni ({amount})"
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
                      approved={study.approved}
                      learningEnvironments={study.learningEnvironments}
                      period={study.period}
                      competenceRequirements={study.competenceRequirements}
                      assessment={study.assessment}
                    />
                    {renderExtraItem && <EmptyItem />}
                  </React.Fragment>
                )
              })}
              {!mockPlannedStudies.length && (
                <div>
                  <FormattedMessage
                    id="opintosuunnitelma.noPlannedStudies"
                    defaultMessage="Ei suunniteltuja opintoja"
                  />
                  .
                </div>
              )}
            </Studies>
          </Accordion>

          <Accordion
            open={activeAccordions.suunnitelmat.valmiit}
            onToggle={this.toggleAccordion("suunnitelmat", "valmiit")}
            title={
              <FormattedMessage
                id="opintosuunnitelma.completedStudiesTitle"
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
                      approved={study.approved}
                      learningEnvironments={study.learningEnvironments}
                      period={study.period}
                      competenceRequirements={study.competenceRequirements}
                      assessment={study.assessment}
                    />
                    {renderExtraItem && <EmptyItem />}
                  </React.Fragment>
                )
              })}
              {!mockCompletedStudies.length && (
                <div>
                  <FormattedMessage
                    id="opintosuunnitelma.noCompletedStudies"
                    defaultMessage="Ei valmiita opintoja"
                  />
                  .
                </div>
              )}
            </Studies>
          </Accordion>

          <Accordion
            open={activeAccordions.suunnitelmat.aikatauluttomat}
            onToggle={this.toggleAccordion("suunnitelmat", "aikatauluttomat")}
            title={
              <FormattedMessage
                id="opintosuunnitelma.unscheduledStudiesTitle"
                defaultMessage="Aikatauluttomat opintoni ({amount})"
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
                      approved={study.approved}
                      learningEnvironments={study.learningEnvironments}
                      period={study.period}
                      competenceRequirements={study.competenceRequirements}
                      assessment={study.assessment}
                    />
                    {renderExtraItem && <EmptyItem />}
                  </React.Fragment>
                )
              })}
              {!mockUnscheduledStudies.length && (
                <div>
                  <FormattedMessage
                    id="opintosuunnitelma.noUnscheduledStudies"
                    defaultMessage="Ei aikatauluttomia opintoja"
                  />
                  .
                </div>
              )}
            </Studies>
          </Accordion>
        </Accordion>

        <Accordion
          open={activeAccordions.tukevatOpinnot}
          title={
            <FormattedMessage
              id="opintosuunnitelma.supportingStudies"
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
