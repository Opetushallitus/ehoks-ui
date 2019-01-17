import { MobileSlider, Slide } from "components/MobileSlider"
import { TempLearningPeriod } from "components/StudyInfo"
import React from "react"
import { FormattedMessage } from "react-intl"
import MediaQuery from "react-responsive"
import styled from "styled"
import { breakpoints } from "theme"
import { LearningPeriodDates } from "./LearningPeriodDates"
import {
  Container,
  EmptyTD,
  InfoContainer,
  Table,
  TBody,
  TD,
  TH,
  Title
} from "./Shared"

const LearningPeriodTitle = styled(Title)`
  padding-left: 20px;
`

const LearningPeriodTable = styled(Table)`
  margin-left: 20px;
`

const CustomSlider = styled(MobileSlider)`
  margin: 10px 0 0 0;
  border-left: 0;
  border-right: 0;
`

interface LearningPeriodProps {
  accentColor?: string
  // TODO: use type from mobx-state-tree
  learningPeriod: TempLearningPeriod
}

export class LearningPeriod extends React.Component<LearningPeriodProps> {
  render() {
    const { accentColor, learningPeriod } = this.props
    const { assignments = [], period = [] } = learningPeriod
    return (
      <Container>
        {(period[0] || period[1]) && (
          <LearningPeriodTitle accentColor={accentColor}>
            <LearningPeriodDates learningPeriod={learningPeriod} />
          </LearningPeriodTitle>
        )}
        <LearningPeriodTable>
          <TBody>
            <tr>
              <TH>
                <FormattedMessage
                  id="opiskelusuunnitelma.tyopaikkaohjaajaTitle"
                  defaultMessage="Työpaikkaohjaaja"
                />
              </TH>
              <TD>{learningPeriod.instructor}</TD>
            </tr>
            <tr>
              <TH>
                <FormattedMessage
                  id="opiskelusuunnitelma.keskeisetTyotehtavatTitle"
                  defaultMessage="Keskeiset työtehtävät"
                />
              </TH>
              <EmptyTD />
            </tr>
          </TBody>
        </LearningPeriodTable>
        <MediaQuery maxWidth={breakpoints.Tablet}>
          {matches => {
            if (matches) {
              return (
                <CustomSlider>
                  {assignments.map((assignment, i) => {
                    return <Slide key={i}>{assignment}</Slide>
                  })}
                </CustomSlider>
              )
            } else {
              return (
                <InfoContainer>
                  {assignments.map((assignment, i) => {
                    return <li key={i}>{assignment}</li>
                  })}
                </InfoContainer>
              )
            }
          }}
        </MediaQuery>
      </Container>
    )
  }
}
