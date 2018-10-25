import { TempLearningPeriod } from "components/StudyInfo"
import React from "react"
import { FormattedMessage } from "react-intl"
import { LearningPeriodDates } from "./LearningPeriodDates"
import {
  Container,
  InfoContainer,
  Table,
  TBody,
  TD,
  TH,
  THead,
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
    return (
      <Container>
        <Title accentColor={accentColor}>
          <LearningPeriodDates learningPeriod={learningPeriod} />
        </Title>
        <Table>
          <THead>
            <tr>
              <TH>
                <FormattedMessage
                  id="opiskelusuunnitelma.workplaceInstructor"
                  defaultMessage="Työpaikkaohjaaja"
                />
              </TH>
            </tr>
            <tr>
              <TH>
                <FormattedMessage
                  id="opiskelusuunnitelma.assignments"
                  defaultMessage="Keskeiset työtehtävät"
                />
              </TH>
            </tr>
          </THead>
          <TBody>
            <tr>
              <TD>{learningPeriod.instructor}</TD>
            </tr>
            <tr>
              <TD>&nbsp;</TD>
            </tr>
          </TBody>
        </Table>
        <InfoContainer>
          {learningPeriod.assignments.map((assignment, i) => {
            return <li key={i}>{assignment}</li>
          })}
        </InfoContainer>
      </Container>
    )
  }
}
