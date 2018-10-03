import { RouteComponentProps } from "@reach/router"
import { Accordion } from "components/Accordion"
import React from "react"
import { FormattedMessage } from "react-intl"
import { Heading } from "routes/Home/Heading"
import { SectionContainer } from "routes/Home/SectionContainer"

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
          suoritettavat opinnot
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
