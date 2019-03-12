import React from "react"
import { intlShape, FormattedMessage } from "react-intl"
import styled from "styled"
import { Collapse } from "./Collapse"
import { Demonstration } from "./Demonstration"
import { Expand } from "./Expand"
import { IconContainer } from "./IconContainer"
import { LearningPeriod } from "./LearningPeriod"
import { Harjoittelujakso, Naytto } from "models/helpers/TutkinnonOsa"
import { LearningEvent } from "./LearningEvent"

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

const LocationsContainer = styled("div")`
  display: flex;
  flex: 1;
  align-items: flex-start;
  justify-content: flex-end;
`

const LocationsContainerExpanded = styled(LocationsContainer)`
  padding-top: 10px;
  padding-right: 10px;
`

interface DetailsProps {
  fadedColor?: string
  demonstrations?: Array<Naytto>
  expanded?: boolean
  learningPeriods?: Array<Harjoittelujakso>
  toggle: (name: "competences" | "details") => () => void
}

export class Details extends React.Component<DetailsProps> {
  static contextTypes = {
    intl: intlShape
  }
  render() {
    const {
      fadedColor = "",
      demonstrations = [],
      expanded,
      learningPeriods = [],
      toggle
    } = this.props
    const { intl } = this.context

    return expanded ? (
      <DetailsExpanded fadedColor={fadedColor}>
        <DetailsContent>
          <LocationsContainerExpanded>
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
            return <LearningPeriod key={i} learningPeriod={period} />
          })}
          {demonstrations.map((demonstration, i) => {
            return <Demonstration key={i} demonstration={demonstration} />
          })}
        </DetailsContent>
      </DetailsExpanded>
    ) : (
      <DetailsCollapsed fadedColor={fadedColor}>
        <LocationsContainer>
          <DetailsContent>
            {learningPeriods.map(lp => {
              return (
                <LearningEvent
                  title={
                    lp.tyyppi === "OTHER" ? (
                      lp.nimi
                    ) : (
                      <FormattedMessage
                        id="opiskelusuunnitelma.tyossaoppiminenTitle"
                        defaultMessage="Työpaikalla oppiminen"
                      />
                    )
                  }
                  type={lp.tyyppi}
                  description={lp.selite}
                  startDate={lp.alku}
                  endDate={lp.loppu}
                />
              )
            })}
            {demonstrations.map(d => {
              return (
                <LearningEvent
                  title={
                    <FormattedMessage
                      id="opiskelusuunnitelma.nayttoTitle"
                      defaultMessage="Näyttö"
                    />
                  }
                  type={d.tyyppi}
                  description={d.organisaatio}
                  startDate={d.alku}
                  endDate={d.loppu}
                />
              )
            })}
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
