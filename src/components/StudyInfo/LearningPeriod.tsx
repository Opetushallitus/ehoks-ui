import { MobileSlider, Slide } from "components/MobileSlider"
import { TempLearningPeriod } from "components/StudyInfo"
import React from "react"
import { FormattedMessage } from "react-intl"
import MediaQuery from "react-responsive"
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

interface LearningPeriodProps {
  accentColor?: string
  // TODO: use type from mobx-state-tree
  learningPeriod: TempLearningPeriod
}

export class LearningPeriod extends React.Component<LearningPeriodProps> {
  render() {
    const { accentColor, learningPeriod } = this.props
    const { assignments = [] } = learningPeriod
    return (
      <Container>
        <Title accentColor={accentColor}>
          <LearningPeriodDates learningPeriod={learningPeriod} />
        </Title>
        <Table>
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
        </Table>
        <MediaQuery maxWidth={breakpoints.Tablet}>
          {matches => {
            if (matches) {
              return (
                <MobileSlider>
                  {assignments.map((assignment, i) => {
                    return <Slide key={i}>{assignment}</Slide>
                  })}
                </MobileSlider>
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
