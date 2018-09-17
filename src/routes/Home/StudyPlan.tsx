import { RouteComponentProps } from "@reach/router"
import { Accordion } from "components/Accordion"
import React from "react"
import { Heading } from "routes/Home/Heading"
import { SectionContainer } from "routes/Home/SectionContainer"

export interface StudyPlanProps {
  children?: React.ReactChildren
}

export interface StudyPlanState {
  activeAccordions: {
    [accordionName: string]: boolean
  }
}

export class StudyPlan extends React.Component<
  StudyPlanProps & RouteComponentProps,
  StudyPlanState
> {
  state = {
    activeAccordions: {
      qualificationModules: false,
      selectedStudies: false,
      studyPreparednessSupportingStudies: false
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
        <Heading>Opiskelusuunnitelmani</Heading>

        <Accordion
          open={this.state.activeAccordions.selectedStudies}
          title="Suoritettavat opinnot"
          onToggle={this.toggleAccordion("selectedStudies")}
          helpIcon={true}
        >
          suoritettavat opinnot
        </Accordion>

        <Accordion
          open={this.state.activeAccordions.qualificationModules}
          title="Tutkinnon osat"
          onToggle={this.toggleAccordion("qualificationModules")}
          helpIcon={true}
        >
          tutkinnon osat
        </Accordion>

        <Accordion
          open={this.state.activeAccordions.studyPreparednessSupportingStudies}
          title="Opiskeluvalmiuksia tukevat opinnot"
          onToggle={this.toggleAccordion("studyPreparednessSupportingStudies")}
          helpIcon={true}
        >
          opiskeluvalmiuksia tukevat opinnot
        </Accordion>
      </SectionContainer>
    )
  }
}
