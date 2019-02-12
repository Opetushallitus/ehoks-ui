import { MobileSlider, Slide } from "components/MobileSlider"
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
import { SnapshotOrInstance } from "mobx-state-tree"
import { Harjoittelujakso } from "models/Harjoittelujakso"

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
  learningPeriod: SnapshotOrInstance<typeof Harjoittelujakso>
}

export class LearningPeriod extends React.Component<LearningPeriodProps> {
  render() {
    const { accentColor, learningPeriod } = this.props
    const { tyotehtavat = [], ajankohta } = learningPeriod
    return (
      <Container>
        {ajankohta && (ajankohta.alku || ajankohta.loppu) && (
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
              <TD>{learningPeriod.ohjaaja}</TD>
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
                  {tyotehtavat.map((tyotehtava, i) => {
                    return <Slide key={i}>{tyotehtava}</Slide>
                  })}
                </CustomSlider>
              )
            } else {
              return (
                <InfoContainer>
                  {tyotehtavat.map((tyotehtava, i) => {
                    return <li key={i}>{tyotehtava}</li>
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
