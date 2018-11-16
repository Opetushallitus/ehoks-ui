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

interface DetailsCollapsedProps {
  fadedColor: string
}
const DetailsCollapsed = styled("div")`
  display: flex;
  flex-direction: row;
  height: 100%;
  padding: 10px 10px 20px 20px;
  justify-content: space-between;
  background: ${(props: DetailsCollapsedProps) =>
    props.fadedColor ? props.fadedColor : "#fef8f3"};
  border-top: 1px solid #c9cdcf;
  border-bottom: 1px solid #c9cdcf;
`

const DetailsExpanded = styled(DetailsCollapsed)`
  padding: 10px 10px 0 20px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    padding: 10px 10px 0 10px;
  }
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

const LocationsContainer = styled("div")`
  display: flex;
  align-items: center;
`

interface DetailsProps {
  accentColor?: string
  demonstrations?: TempDemonstration[]
  expanded?: boolean
  fadedColor?: string
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
      fadedColor = "",
      learningPeriods = [],
      locations = [],
      toggle
    } = this.props
    const { intl } = this.context
    const learningPeriod = learningPeriods[0]
    return expanded ? (
      <DetailsExpanded fadedColor={fadedColor}>
        <DetailsContent>
          <LocationsContainer>
            {locations.length > 0 && (
              <LearningEnvironments>
                {locations.join(", ")}
              </LearningEnvironments>
            )}
            <IconContainer
              onClick={toggle("details")}
              aria-label={intl.formatMessage({
                id: "opiskelusuunnitelma.piilotaTyossaOppiminenAriaLabel"
              })}
            >
              <Collapse size={40} />
            </IconContainer>
          </LocationsContainer>
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
      <DetailsCollapsed fadedColor={fadedColor}>
        <DetailsContent>
          <LocationsContainer>
            {locations.length > 0 && (
              <LearningEnvironments>
                {locations.join(", ")}
              </LearningEnvironments>
            )}
            <IconContainer
              onClick={toggle("details")}
              aria-label={intl.formatMessage({
                id: "opiskelusuunnitelma.naytaTyossaOppiminenAriaLabel"
              })}
            >
              <Expand size={40} />
            </IconContainer>
          </LocationsContainer>
          <Period accentColor={accentColor}>
            <LearningPeriodDates learningPeriod={learningPeriod} />
            {demonstrations.length > 0 && (
              <React.Fragment>
                {", "}
                <DemonstrationDates demonstration={demonstrations[0]} />
              </React.Fragment>
            )}
          </Period>
        </DetailsContent>
      </DetailsCollapsed>
    )
  }
}
