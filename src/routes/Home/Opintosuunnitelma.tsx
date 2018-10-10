import { RouteComponentProps } from "@reach/router"
import { Accordion } from "components/Accordion"
import { InfoTable } from "components/InfoTable"
import { StatBox, StatBoxes, StatNumber, StatTitle } from "components/StatBox"
import { EmptyItem, StudyInfo } from "components/StudyInfo"
import React from "react"
import styled from "react-emotion"
import { FormattedMessage, intlShape } from "react-intl"
import { Heading } from "routes/Home/Heading"
import { SectionContainer } from "routes/Home/SectionContainer"

// TODO: map real API response after this in Model's views
interface MockStudy {
  id: number
  approved?: Date
  assessment?: string[]
  competenceRequirements?: string[]
  learningEnvironments?: string[]
  link: string
  period?: Date[]
  title: string
}
const mockPlannedStudies: MockStudy[] = [
  {
    assessment: [],
    competenceRequirements: [],
    id: 0,
    learningEnvironments: ["Opinpaikka", "Lähiopetus"],
    link: "https://www.google.fi",
    period: [new Date("2018.05.24"), new Date("2018.05.31")],
    title: "Ikääntyvien osallisuuden edistäminen"
  },
  {
    approved: new Date("2018.04.01"),
    assessment: [],
    competenceRequirements: [],
    id: 1,
    learningEnvironments: ["Tavastia", "Muualla suoritettu"],
    link: "https://www.google.fi",
    period: [],
    title: "Viestintä ja vuorovaikutus suomi toisena kielenä"
  }
]
const mockCompletedStudies: MockStudy[] = [
  {
    assessment: [],
    competenceRequirements: [],
    id: 0,
    learningEnvironments: [
      "Palvelutalo Villilän niemi",
      "Työpaikalla oppiminen"
    ],
    link: "https://www.google.fi",
    period: [new Date("2018.03.01"), new Date("2018.05.31")],
    title: "Kotihoidossa toimiminen"
  },
  {
    assessment: [],
    competenceRequirements: [],
    id: 1,
    learningEnvironments: ["Opinpaikka", "Lähiopetus"],
    link: "https://www.google.fi",
    period: [new Date("2018.05.24"), new Date("2018.05.31")],
    title: "Ikääntyvien osallisuuden edistäminen"
  },
  {
    approved: new Date("2018.04.01"),
    assessment: [],
    competenceRequirements: [],
    id: 2,
    learningEnvironments: ["Tavastia", "Muualla suoritettu"],
    link: "https://www.google.fi",
    period: [],
    title: "Viestintä ja vuorovaikutus suomi toisena kielenä"
  },
  {
    assessment: [],
    competenceRequirements: [],
    id: 3,
    learningEnvironments: ["Projektiryhmä", "Verkko-opiskelu ja lähiopetus"],
    link: "https://www.google.fi",
    period: [new Date("2018.09.01"), new Date("2018.09.15")],
    title: "Yrityksessä toimiminen"
  }
]
const mockUnscheduledStudies: MockStudy[] = [
  {
    assessment: [],
    competenceRequirements: [],
    id: 0,
    learningEnvironments: [],
    link: "https://www.google.fi",
    period: [],
    title: "Kotihoidossa toimiminen"
  },
  {
    assessment: [],
    competenceRequirements: [],
    id: 1,
    learningEnvironments: [],
    link: "https://www.google.fi",
    period: [],
    title: "Ikääntyvien osallisuuden edistäminen"
  },
  {
    assessment: [],
    competenceRequirements: [],
    id: 2,
    learningEnvironments: [],
    link: "https://www.google.fi",
    period: [],
    title: "Viestintä ja vuorovaikutus suomi toisena kielenä"
  },
  {
    assessment: [],
    competenceRequirements: [],
    id: 3,
    learningEnvironments: [],
    link: "https://www.google.fi",
    period: [],
    title: "Yrityksessä toimiminen"
  },
  {
    assessment: [],
    competenceRequirements: [],
    id: 4,
    learningEnvironments: [],
    link: "https://www.google.fi",
    period: [],
    title: "Viestintä ja vuorovaikutus suomi toisena kielenä"
  },
  {
    assessment: [],
    competenceRequirements: [],
    id: 5,
    learningEnvironments: [],
    link: "https://www.google.fi",
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
      suunnitelma: false,
      suunnitelmat: {
        aikatauluttomat: false,
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
                      title={study.title}
                      approved={study.approved}
                      learningEnvironments={study.learningEnvironments}
                      period={study.period}
                      competenceRequirements={study.competenceRequirements}
                      assessment={study.assessment}
                      href={study.link}
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
                      title={study.title}
                      approved={study.approved}
                      learningEnvironments={study.learningEnvironments}
                      period={study.period}
                      competenceRequirements={study.competenceRequirements}
                      assessment={study.assessment}
                      href={study.link}
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
                      title={study.title}
                      approved={study.approved}
                      learningEnvironments={study.learningEnvironments}
                      period={study.period}
                      competenceRequirements={study.competenceRequirements}
                      assessment={study.assessment}
                      href={study.link}
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
