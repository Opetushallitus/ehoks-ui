import { RouteComponentProps } from "@reach/router"
import { Accordion } from "components/Accordion"
import { InfoTable } from "components/InfoTable"
import { StatBox, StatBoxes, StatNumber, StatTitle } from "components/StatBox"
import React from "react"
import styled from "react-emotion"
import { FormattedMessage, intlShape } from "react-intl"
import { Heading } from "routes/Home/Heading"
import { SectionContainer } from "routes/Home/SectionContainer"

const FlexFiller = styled("div")`
  flex: 1;
`

export interface OpintosuunnitelmaProps {
  children?: React.ReactChildren
}

export interface OpintosuunnitelmaState {
  activeAccordions: {
    [accordionName: string]: boolean
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
      tavoitteet: false,
      tukevatOpinnot: false
    }
  }
  toggleAccordion = (accordion: string) => () => {
    this.setState(state => ({
      ...state,
      activeAccordions: {
        ...state.activeAccordions,
        [accordion]: !state.activeAccordions[accordion]
      }
    }))
  }

  render() {
    const { intl } = this.context
    return (
      <SectionContainer>
        <Heading>
          <FormattedMessage
            id="opintosuunnitelma.title"
            defaultMessage="Opiskelusuunnitelmani"
          />
        </Heading>

        <Accordion
          open={this.state.activeAccordions.tavoitteet}
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
          open={this.state.activeAccordions.suunnitelma}
          title={
            <FormattedMessage
              id="opintosuunnitelma.plan"
              defaultMessage="Suunnitelma tutkinnonosittain"
            />
          }
          onToggle={this.toggleAccordion("suunnitelma")}
          helpIcon={true}
        >
          tutkinnon osat
        </Accordion>

        <Accordion
          open={this.state.activeAccordions.tukevatOpinnot}
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
