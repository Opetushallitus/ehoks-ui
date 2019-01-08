import { RouteComponentProps } from "@reach/router"
import { ContentArea } from "components/ContentArea"
import { EmptyItem } from "components/EmptyItem"
import { Heading } from "components/Heading"
import { HelpPopup } from "components/HelpPopup"
import { StudiesContainer } from "components/StudiesContainer"
import { StudyInfo } from "components/StudyInfo"
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
    const { intl } = this.context
    const mockStudy = {
      id: 1,
      competenceRequirements: [],
      demonstrations: [],
      title: "Yrityksessä toimiminen",
      competencePoints: 4,
      locations: ["Tavastia", "Muualla suoritettu"],
      learningPeriods: [
        {
          approved: "2018-04-01",
          instructor: "Etunimi Sukunimi, Organisaatio",
          assignments: [
            "Tehtävä ja kuvaus tehtävän sisällöstä",
            "Tehtävä ja kuvaus tehtävän sisällöstä",
            "Tehtävä ja kuvaus tehtävän sisällöstä",
            "Tehtävä ja kuvaus tehtävän sisällöstä"
          ]
        }
      ]
    }
    const mockStudies = [mockStudy, mockStudy, mockStudy, mockStudy, mockStudy]

    const competencePointsTitle = intl.formatMessage({
      id: "opiskelusuunnitelma.osaamispisteLyhenne"
    })

    return (
      <React.Fragment>
        <HeadingContainer>
          <HelpHeading>
            <FormattedMessage
              id="aiempiOsaaminen.title"
              defaultMessage="Aiempi osaamiseni"
            />
          </HelpHeading>
          <HelpPopup helpContent={"Test"} />
        </HeadingContainer>

        <ContentArea>
          <StudiesContainer>
            {mockStudies.map((study, i) => {
              const renderExtraItem = (i + 1) % 4 === 0
              return (
                <React.Fragment key={i}>
                  <StudyInfo
                    accentColor="#43A047"
                    fadedColor="#ECF6ED"
                    title={`${study.title} ${
                      study.competencePoints
                    } ${competencePointsTitle}`}
                    locations={study.locations}
                    learningPeriods={study.learningPeriods}
                    competenceRequirements={study.competenceRequirements}
                    demonstrations={study.demonstrations}
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
