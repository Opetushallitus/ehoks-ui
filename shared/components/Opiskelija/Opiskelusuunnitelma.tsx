import { RouteComponentProps } from "@reach/router"
import { Accordion, AccordionTitle } from "components/Accordion"
import { EmptyItem } from "components/EmptyItem"
import { Heading } from "components/Heading"
import { InfoTable } from "components/InfoTable"
import { LabeledColumn } from "components/LabeledColumn"
import { ProgressPie } from "components/ProgressPie"
import { StatBoxes } from "components/StatBox"
import { StudiesContainer } from "components/StudiesContainer"
import { StudyInfo } from "components/StudyInfo"
import { observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import { HOKS } from "models/HOKS"
import React from "react"
import { FormattedMessage, intlShape } from "react-intl"
import styled from "styled"

const ProgressTitle = styled("h2")`
  font-weight: 600;
  font-size: 20px;
  margin-left: 4px;
`

export interface OpiskelusuunnitelmaProps {
  children?: React.ReactChildren
  plan: Instance<typeof HOKS>
  titles?: {
    heading?: React.ReactNode
    goals?: React.ReactNode
  }
}

export interface OpiskelusuunnitelmaState {
  activeAccordions: {
    [accordionName: string]: boolean | { [subAccordionName: string]: boolean }
  }
}

@observer
export class Opiskelusuunnitelma extends React.Component<
  OpiskelusuunnitelmaProps & RouteComponentProps,
  OpiskelusuunnitelmaState
> {
  static contextTypes = {
    intl: intlShape
  }
  state = {
    activeAccordions: {
      suunnitelma: false,
      suunnitelmat: {
        aikataulutetut: false,
        suunnitellut: false,
        valmiit: false
      },
      tavoitteet: false,
      tukevatOpinnot: false
    }
  }

  componentDidMount() {
    window.requestAnimationFrame(() => {
      window.scrollTo(0, 0)
    })
  }

  showPlanSubAccordion = (subAccordion: string) => () => {
    this.setState(
      state => ({
        ...state,
        activeAccordions: {
          ...state.activeAccordions,
          suunnitelma: true,
          suunnitelmat: {
            ...(state.activeAccordions.suunnitelmat as {
              [subAccordionName: string]: boolean
            }),
            [subAccordion]: true
          }
        }
      }),
      () => {
        window.location.hash = `suunnitelma.${subAccordion}`
      }
    )
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
    const { plan, titles: customTitles = {} } = this.props
    const { suunnitellutOpinnot, aikataulutetutOpinnot, valmiitOpinnot } = plan
    const competencePointsTitle = intl.formatMessage({
      id: "opiskelusuunnitelma.osaamispisteLyhenne"
    })

    const titles = {
      heading: customTitles.heading || (
        <FormattedMessage
          id="opiskelusuunnitelma.title"
          defaultMessage="Opiskelusuunnitelmani"
        />
      ),
      goals: (
        <AccordionTitle>
          {customTitles.goals || (
            <FormattedMessage
              id="opiskelusuunnitelma.tavoitteetTitle"
              defaultMessage="Tavoitteeni ja opintojen eteneminen"
            />
          )}
        </AccordionTitle>
      )
    }

    const totalStudiesLength =
      suunnitellutOpinnot.length +
      aikataulutetutOpinnot.length +
      valmiitOpinnot.length

    return (
      <React.Fragment>
        <Heading>{titles.heading}</Heading>

        <Accordion
          id="tavoitteet"
          open={activeAccordions.tavoitteet}
          title={titles.goals}
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
                <LabeledColumn id="opiskelusuunnitelma.tutkinnonNimiTitle">
                  {plan.tutkinnonNimi}
                </LabeledColumn>
                <LabeledColumn id="opiskelusuunnitelma.laajuusTitle">
                  {plan.osaamispisteet}{" "}
                  <FormattedMessage
                    id="opiskelusuunnitelma.osaamispistettaPostfix"
                    defaultMessage="osaamispistettä"
                  />
                </LabeledColumn>
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
                <LabeledColumn id="opiskelusuunnitelma.osaamisalaTitle">
                  {plan.osaamisala}
                </LabeledColumn>
                <LabeledColumn id="opiskelusuunnitelma.tutkintonimikeTitle">
                  {plan.tutkintonimike}
                </LabeledColumn>
                <td />
              </tr>
            </tbody>
          </InfoTable>

          <ProgressTitle>
            <FormattedMessage
              id="opiskelusuunnitelma.opintosiTitle"
              defaultMessage="Opintojen eteneminen"
            />
          </ProgressTitle>

          <StatBoxes>
            <ProgressPie
              percentage={Math.round(
                (suunnitellutOpinnot.length / totalStudiesLength) * 100
              )}
              stroke="#FF5000"
              title={
                <FormattedMessage
                  id="opiskelusuunnitelma.suunniteltunaTitle"
                  defaultMessage="Suunniteltuna"
                />
              }
              onClick={this.showPlanSubAccordion("suunnitellut")}
            />
            <ProgressPie
              percentage={Math.round(
                (aikataulutetutOpinnot.length / totalStudiesLength) * 100
              )}
              stroke="#FFD900"
              title={
                <FormattedMessage
                  id="opiskelusuunnitelma.aikataulutettunaTitle"
                  defaultMessage="Aikataulutettuna"
                />
              }
              onClick={this.showPlanSubAccordion("aikataulutetut")}
            />
            <ProgressPie
              percentage={Math.round(
                (valmiitOpinnot.length / totalStudiesLength) * 100
              )}
              stroke="#5BCA16"
              title={
                <FormattedMessage
                  id="opiskelusuunnitelma.valmiinaTitle"
                  defaultMessage="Valmiina"
                />
              }
              onClick={this.showPlanSubAccordion("valmiit")}
            />
          </StatBoxes>
        </Accordion>

        <Accordion
          id="suunnitelma"
          open={activeAccordions.suunnitelma}
          title={
            <AccordionTitle>
              <FormattedMessage
                id="opiskelusuunnitelma.suunnitelmaTutkinnonosittainTitle"
                defaultMessage="Suunnitelma tutkinnonosittain"
              />
            </AccordionTitle>
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
              <AccordionTitle>
                <FormattedMessage
                  id="opiskelusuunnitelma.suunnitellutOpintoniTitle"
                  defaultMessage="Suunnitellut opintoni ({amount})"
                  values={{ amount: suunnitellutOpinnot.length }}
                />
              </AccordionTitle>
            }
            inline={true}
            childContainer={false}
          >
            <StudiesContainer>
              {suunnitellutOpinnot.map((study, i) => {
                const renderExtraItem = (i + 1) % 4 === 0
                return (
                  <React.Fragment key={`${study.id}_${i}`}>
                    <StudyInfo
                      accentColor="#EB6F02"
                      fadedColor="#FDF1E6"
                      title={study.opintoOtsikko(competencePointsTitle)}
                      locations={study.sijainnit}
                      learningPeriods={study.harjoittelujaksot}
                      competenceRequirements={study.osaamisvaatimukset}
                      demonstrations={study.naytot}
                    />
                    {renderExtraItem && <EmptyItem />}
                  </React.Fragment>
                )
              })}
              {!suunnitellutOpinnot.length && (
                <div>
                  <FormattedMessage
                    id="opiskelusuunnitelma.eiSuunniteltujaOpintojaTitle"
                    defaultMessage="Ei suunniteltuja opintoja"
                  />
                  .
                </div>
              )}
            </StudiesContainer>
          </Accordion>

          <Accordion
            id="suunnitelma.aikataulutetut"
            open={activeAccordions.suunnitelmat.aikataulutetut}
            onToggle={this.toggleAccordion("suunnitelmat", "aikataulutetut")}
            title={
              <AccordionTitle>
                <FormattedMessage
                  id="opiskelusuunnitelma.aikataulutetutOpintoniTitle"
                  defaultMessage="Aikataulutetut opintoni ({amount})"
                  values={{ amount: aikataulutetutOpinnot.length }}
                />
              </AccordionTitle>
            }
            inline={true}
            childContainer={false}
          >
            <StudiesContainer>
              {aikataulutetutOpinnot.map((study, i) => {
                const renderExtraItem = (i + 1) % 4 === 0
                return (
                  <React.Fragment key={`${study.id}_${i}`}>
                    <StudyInfo
                      accentColor="#E2A626"
                      fadedColor="#FDF6E9"
                      title={study.opintoOtsikko(competencePointsTitle)}
                      locations={study.sijainnit}
                      learningPeriods={study.harjoittelujaksot}
                      competenceRequirements={study.osaamisvaatimukset}
                      demonstrations={study.naytot}
                    />
                    {renderExtraItem && <EmptyItem />}
                  </React.Fragment>
                )
              })}
              {!aikataulutetutOpinnot.length && (
                <div>
                  <FormattedMessage
                    id="opiskelusuunnitelma.eiAikataulutettujaOpintojaTitle"
                    defaultMessage="Ei aikataulutettuja opintoja"
                  />
                  .
                </div>
              )}
            </StudiesContainer>
          </Accordion>

          <Accordion
            id="suunnitelma.valmiit"
            open={activeAccordions.suunnitelmat.valmiit}
            onToggle={this.toggleAccordion("suunnitelmat", "valmiit")}
            title={
              <AccordionTitle>
                <FormattedMessage
                  id="opiskelusuunnitelma.valmiitOpintoniTitle"
                  defaultMessage="Valmiit opintoni ({amount})"
                  values={{ amount: valmiitOpinnot.length }}
                />
              </AccordionTitle>
            }
            inline={true}
            childContainer={false}
          >
            <StudiesContainer>
              {valmiitOpinnot.map((study, i) => {
                const renderExtraItem = (i + 1) % 4 === 0
                return (
                  <React.Fragment key={`${study.id}_${i}`}>
                    <StudyInfo
                      accentColor="#43A047"
                      fadedColor="#ECF6ED"
                      title={study.opintoOtsikko(competencePointsTitle)}
                      locations={study.sijainnit}
                      learningPeriods={study.harjoittelujaksot}
                      competenceRequirements={study.osaamisvaatimukset}
                      demonstrations={study.naytot}
                    />
                    {renderExtraItem && <EmptyItem />}
                  </React.Fragment>
                )
              })}
              {!valmiitOpinnot.length && (
                <div>
                  <FormattedMessage
                    id="opiskelusuunnitelma.eiValmiitaOpintojaTitle"
                    defaultMessage="Ei valmiita opintoja"
                  />
                  .
                </div>
              )}
            </StudiesContainer>
          </Accordion>
        </Accordion>

        <Accordion
          id="tukevatOpinnot"
          open={activeAccordions.tukevatOpinnot}
          title={
            <AccordionTitle>
              <FormattedMessage
                id="opiskelusuunnitelma.opiskeluvalmiuksiaTukevatOpinnotTitle"
                defaultMessage="Opiskeluvalmiuksia tukevat opinnot"
              />
            </AccordionTitle>
          }
          onToggle={this.toggleAccordion("tukevatOpinnot")}
          helpIcon={true}
        >
          opiskeluvalmiuksia tukevat opinnot
        </Accordion>
      </React.Fragment>
    )
  }
}
