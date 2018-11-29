import { MobileSlider, Slide } from "components/MobileSlider"
import { TempDemonstration } from "components/StudyInfo"
import { css } from "emotion"
import React from "react"
import { FormattedMessage } from "react-intl"
import MediaQuery from "react-responsive"
import styled from "styled"
import { breakpoints } from "theme"
import { DemonstrationDates } from "./DemonstrationDates"
import { Container, InfoContainer, Table, TBody, TD, TH, Title } from "./Shared"

const DemonstrationTitle = styled(Title)`
  padding-left: 20px;
`

const DemonstrationTable = styled(Table)`
  margin-left: 20px;
`

const customSlider = css`
  margin: 10px 0 0 0;
  border-left: 0;
  border-right: 0;
`

interface DemonstrationProps {
  accentColor?: string
  // TODO: use type from mobx-state-tree
  demonstration: TempDemonstration
}

export class Demonstration extends React.Component<DemonstrationProps> {
  render() {
    const { accentColor, demonstration } = this.props
    return (
      <Container>
        <DemonstrationTitle accentColor={accentColor}>
          <DemonstrationDates demonstration={demonstration} />
        </DemonstrationTitle>
        <DemonstrationTable>
          <TBody>
            <tr>
              <TH>
                <FormattedMessage
                  id="opiskelusuunnitelma.nayttopaikkaTitle"
                  defaultMessage="Näyttöpaikka"
                />
              </TH>
              <TD>{demonstration.organisation}</TD>
            </tr>
            <tr>
              <TH>
                <FormattedMessage
                  id="opiskelusuunnitelma.nayttoymparistoTitle"
                  defaultMessage="Näyttöympäristö"
                />
              </TH>
              <TD>{demonstration.environment}</TD>
            </tr>
            <tr>
              <TH>
                <FormattedMessage
                  id="opiskelusuunnitelma.arvioijatTitle"
                  defaultMessage="Näytön arvioijat"
                />
              </TH>
              <TD>{demonstration.assessors.join(", ")}</TD>
            </tr>
          </TBody>
        </DemonstrationTable>
        <MediaQuery maxWidth={breakpoints.Tablet}>
          {matches => {
            if (matches) {
              return (
                <MobileSlider className={customSlider}>
                  {demonstration.assignments.map((assignment, i) => {
                    return <Slide key={i}>{assignment}</Slide>
                  })}
                </MobileSlider>
              )
            } else {
              return (
                <InfoContainer>
                  {demonstration.assignments.map((assignment, i) => {
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
