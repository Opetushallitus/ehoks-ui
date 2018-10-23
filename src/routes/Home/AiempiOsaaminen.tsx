import { RouteComponentProps } from "@reach/router"
import { Accordion } from "components/Accordion"
import React from "react"
import { FormattedMessage } from "react-intl"
import { Heading } from "routes/Home/Heading"
import { SectionContainer } from "routes/Home/SectionContainer"

export interface AiempiOsaaminenProps {
  children?: React.ReactChildren
}

export interface AiempiOsaaminenState {
  activeAccordions: {
    [accordionName: string]: boolean
  }
}

export class AiempiOsaaminen extends React.Component<
  AiempiOsaaminenProps & RouteComponentProps,
  AiempiOsaaminenState
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
        <Heading>
          <FormattedMessage
            id="aiempiOsaaminen.title"
            defaultMessage="Osaamisen tunnustaminen"
          />
        </Heading>

        <Accordion
          open={this.state.activeAccordions.previousCompetence}
          title={
            <FormattedMessage
              id="aiempiOsaaminen.previousCompetence"
              defaultMessage="Tunnustetut opintoni"
            />
          }
          onToggle={this.toggleAccordion("previousCompetence")}
          helpIcon={true}
        >
          aiemmin hankittu osaaminen
        </Accordion>
      </SectionContainer>
    )
  }
}
