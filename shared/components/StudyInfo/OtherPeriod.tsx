import React from "react"
import styled from "styled"
import { Container, Title } from "./Shared"
import { MuuOppimisymparisto } from "models/helpers/TutkinnonOsa"
import { LearningEvent } from "components/StudyInfo/LearningEvent"

const LearningPeriodTitle = styled(Title)`
  margin-left: 20px;
  margin-right: 20px;
`

interface OtherPeriodProps {
  otherPeriod: MuuOppimisymparisto
}

export class OtherPeriod extends React.Component<OtherPeriodProps> {
  render() {
    const { otherPeriod } = this.props
    const { alku, loppu } = otherPeriod

    const nimi =
      otherPeriod.oppimisymparisto && otherPeriod.oppimisymparisto.nimi
        ? otherPeriod.oppimisymparisto.nimi
        : ""

    return (
      <Container data-testid="StudyInfo.LearningPeriod">
        {(alku || loppu) && (
          <LearningPeriodTitle>
            <LearningEvent
              title={nimi}
              type="OTHER"
              startDate={alku}
              endDate={loppu}
              size="large"
            />
          </LearningPeriodTitle>
        )}
      </Container>
    )
  }
}
