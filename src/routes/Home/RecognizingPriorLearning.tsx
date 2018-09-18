import { RouteComponentProps } from "@reach/router"
import { Accordion } from "components/Accordion"
import React from "react"
import { Heading } from "routes/Home/Heading"
import { SectionContainer } from "routes/Home/SectionContainer"

export interface RecognizingPriorLearningProps {
  children?: React.ReactChildren
}

export interface RecognizingPriorLearningState {
  activeAccordions: {
    [accordionName: string]: boolean
  }
}

export class RecognizingPriorLearning extends React.Component<
  RecognizingPriorLearningProps & RouteComponentProps,
  RecognizingPriorLearningState
> {
  state = {
    activeAccordions: {
      qualificationUnit: false
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
        <Heading>Osaamisen tunnustaminen</Heading>

        <Accordion
          open={this.state.activeAccordions.qualificationUnit}
          title="Tutkinnon osan nimi"
          onToggle={this.toggleAccordion("qualificationUnit")}
          helpIcon={true}
        >
          tutkinnon osan nimi
        </Accordion>
      </SectionContainer>
    )
  }
}
