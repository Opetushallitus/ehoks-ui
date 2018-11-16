import { MobileSlider, Slide } from "components/MobileSlider"
import { TempDemonstration } from "components/StudyInfo"
import React from "react"
import { FormattedMessage } from "react-intl"
import MediaQuery from "react-responsive"
import { breakpoints } from "theme"
import { DemonstrationDates } from "./DemonstrationDates"
import { Container, InfoContainer, Table, TBody, TD, TH, Title } from "./Shared"

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
        <Title accentColor={accentColor}>
          <DemonstrationDates demonstration={demonstration} />
        </Title>
        <Table>
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
        </Table>
        <MediaQuery maxWidth={breakpoints.Tablet}>
          {matches => {
            if (matches) {
              return (
                <MobileSlider>
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
