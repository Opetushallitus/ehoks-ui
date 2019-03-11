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
import { SnapshotOrInstance } from "mobx-state-tree"
import { Harjoittelujakso } from "models/Harjoittelujakso"
import { Naytto } from "models/Naytto"

interface ColorProps {
  fadedColor: string
}

const DetailsCollapsed = styled("div")`
  display: flex;
  flex-direction: row;
  height: 100%;
  padding: 10px 10px 20px 20px;
  justify-content: space-between;
  background: ${(props: ColorProps) => props.fadedColor};
  border-top: 1px solid #c9cdcf;
`

const DetailsExpanded = styled(DetailsCollapsed)`
  background: ${(props: ColorProps) => props.fadedColor};
  padding: 0;
  border-top: 1px solid #c9cdcf;
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
  fadedColor?: string
  demonstrations?: Array<SnapshotOrInstance<typeof Naytto>>
  expanded?: boolean
  learningPeriods?: Array<SnapshotOrInstance<typeof Harjoittelujakso>>
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
      fadedColor = "",
      demonstrations = [],
      expanded,
      learningPeriods = [],
      locations = [],
      toggle
    } = this.props
    const { intl } = this.context
    const learningPeriod = learningPeriods[0]
    return expanded ? (
      <DetailsExpanded fadedColor={fadedColor}>
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
      <DetailsCollapsed fadedColor={fadedColor}>
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
