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
  flex: 1;
  align-items: center;
  justify-content: flex-end;
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
              {demonstrations.length > 0 && (
                <React.Fragment>
                  {learningPeriod &&
                  learningPeriod.period &&
                  learningPeriod.period.some(Boolean)
                    ? ", "
                    : null}
                  <DemonstrationDates demonstration={demonstrations[0]} />
                </React.Fragment>
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
