import { RouteComponentProps } from "@reach/router"
import { Accordion } from "components/Accordion"
import React from "react"
import { Heading } from "routes/Home/Heading"
import { SectionContainer } from "routes/Home/SectionContainer"

export interface PreviousCompetenceProps {
  children?: React.ReactChildren
}

export interface PreviousCompetenceState {
  activeAccordions: {
    [accordionName: string]: boolean
  }
}

export class PreviousCompetence extends React.Component<
  PreviousCompetenceProps & RouteComponentProps,
  PreviousCompetenceState
> {
  state = {
    activeAccordions: {
      previousCompetence: false
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
        <Heading>Mitä osaamista minulla jo on?</Heading>

        <Accordion
          open={this.state.activeAccordions.previousCompetence}
          title="Aiemmin hankittu osaamiseni"
          onToggle={this.toggleAccordion("previousCompetence")}
          helpIcon={true}
        >
          aiemmin hankittu osaaminen
        </Accordion>
      </SectionContainer>
    )
  }
}
