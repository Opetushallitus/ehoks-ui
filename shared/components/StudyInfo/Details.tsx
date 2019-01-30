import { TempDemonstration, TempLearningPeriod } from "components/StudyInfo"
import React from "react"
import { intlShape } from "react-intl"
import styled from "styled"
import { Collapse } from "./Collapse"
import { Demonstration } from "./Demonstration"
import { DemonstrationDates } from "./DemonstrationDates"
import { Expand } from "./Expand"
import { IconContainer } from "./IconContainer"
import { LearningPeriod } from "./LearningPeriod"
import { LearningPeriodDates } from "./LearningPeriodDates"
import { Period } from "./Period"

const DetailsCollapsed = styled("div")`
  display: flex;
  flex-direction: row;
  height: 100%;
  padding: 10px 10px 20px 20px;
  justify-content: space-between;
  background: #fff;
`

const DetailsExpanded = styled(DetailsCollapsed)`
  padding: 0;
`

const DetailsContent = styled("div")`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const LearningEnvironments = styled("div")`
  flex: 1;
  margin: 10px 0 20px 0;
`

const LearningEnvironmentsExpanded = styled(LearningEnvironments)`
  margin-left: 20px;
`

const LocationsContainer = styled("div")`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
`

const LocationsContainerExpanded = styled(LocationsContainer)`
  padding-top: 10px;
  padding-right: 10px;
`

interface DetailsProps {
  accentColor?: string
  demonstrations?: TempDemonstration[]
  expanded?: boolean
  learningPeriods?: TempLearningPeriod[]
  locations?: string[]
  toggle: (name: "competences" | "details") => () => void
}

export class Details extends React.Component<DetailsProps> {
  static contextTypes = {
    intl: intlShape
  }
  render() {
    const {
      accentColor,
      demonstrations = [],
      expanded,
      learningPeriods = [],
      locations = [],
      toggle
    } = this.props
    const { intl } = this.context
    const learningPeriod = learningPeriods[0]
    return expanded ? (
      <DetailsExpanded>
        <DetailsContent>
          <LocationsContainerExpanded>
            {locations.length > 0 && (
              <LearningEnvironmentsExpanded>
                {locations.join(", ")}
              </LearningEnvironmentsExpanded>
            )}
            <IconContainer
              onClick={toggle("details")}
              aria-label={intl.formatMessage({
                id: "opiskelusuunnitelma.piilotaTyossaOppiminenAriaLabel"
              })}
            >
              <Collapse size={40} />
            </IconContainer>
          </LocationsContainerExpanded>
          {learningPeriods.map((period, i) => {
            return (
              <LearningPeriod
                key={i}
                learningPeriod={period}
                accentColor={accentColor}
              />
            )
          })}
          {demonstrations.map((demonstration, i) => {
            return (
              <Demonstration
                key={i}
                demonstration={demonstration}
                accentColor={accentColor}
              />
            )
          })}
        </DetailsContent>
      </DetailsExpanded>
    ) : (
      <DetailsCollapsed>
        <LocationsContainer>
          <DetailsContent>
            {locations.length > 0 && (
              <LearningEnvironments>
                {locations.join(", ")}
              </LearningEnvironments>
            )}
            <Period accentColor={accentColor}>
              <LearningPeriodDates learningPeriod={learningPeriod} />
              <br />
              {demonstrations.length > 0 && (
                <DemonstrationDates demonstration={demonstrations[0]} />
              )}
            </Period>
          </DetailsContent>
          <IconContainer
            onClick={toggle("details")}
            aria-label={intl.formatMessage({
              id: "opiskelusuunnitelma.naytaTyossaOppiminenAriaLabel"
            })}
          >
            <Expand size={40} />
          </IconContainer>
        </LocationsContainer>
      </DetailsCollapsed>
    )
  }
}
