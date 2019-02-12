import { RouteComponentProps } from "@reach/router"
import { ContentArea } from "components/ContentArea"
import { EmptyItem } from "components/EmptyItem"
import { Heading } from "components/Heading"
import { HelpPopup } from "components/HelpPopup"
import { StudiesContainer } from "components/StudiesContainer"
import { StudyInfo } from "components/StudyInfo"
import { Instance } from "mobx-state-tree"
import { Opinto } from "models/Opinto"
import React from "react"
import { FormattedMessage, intlShape } from "react-intl"
import styled from "styled"

const HeadingContainer = styled("div")`
  display: flex;
  align-items: center;
`

const HelpHeading = styled(Heading)`
  margin-right: 20px;
`

export interface AiempiOsaaminenProps {
  children?: React.ReactChildren
  heading?: React.ReactNode
  studies: Array<Instance<typeof Opinto>>
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
  static contextTypes = {
    intl: intlShape
  }
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
    const {
      studies,
      heading = (
        <FormattedMessage
          id="aiempiOsaaminen.title"
          defaultMessage="Aiempi osaamiseni"
        />
      )
    } = this.props
    const { intl } = this.context
    const competencePointsTitle = intl.formatMessage({
      id: "opiskelusuunnitelma.osaamispisteLyhenne"
    })

    return (
      <React.Fragment>
        <HeadingContainer>
          <HelpHeading>{heading}</HelpHeading>
          <HelpPopup helpContent={"Test"} />
        </HeadingContainer>

        <ContentArea>
          <StudiesContainer>
            {studies.map((study, i) => {
              const renderExtraItem = (i + 1) % 4 === 0
              return (
                <React.Fragment key={i}>
                  <StudyInfo
                    accentColor="#43A047"
                    fadedColor="#ECF6ED"
                    title={`${study.otsikko} ${
                      study.osaamispisteet
                    } ${competencePointsTitle}`}
                    locations={study.sijainnit}
                    learningPeriods={study.harjoittelujaksot}
                    competenceRequirements={study.osaamisvaatimukset}
                    demonstrations={study.naytot}
                  />
                  {renderExtraItem && <EmptyItem />}
                </React.Fragment>
              )
            })}
          </StudiesContainer>
        </ContentArea>
      </React.Fragment>
    )
  }
}
