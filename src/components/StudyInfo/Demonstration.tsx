import { TempDemonstration } from "components/StudyInfo"
import React from "react"
import { FormattedMessage } from "react-intl"
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
                  id="opiskelusuunnitelma.organisation"
                  defaultMessage="Näyttöpaikka"
                />
              </TH>
              <TD>{demonstration.organisation}</TD>
            </tr>
            <tr>
              <TH>
                <FormattedMessage
                  id="opiskelusuunnitelma.environment"
                  defaultMessage="Näyttöympäristö"
                />
              </TH>
              <TD>{demonstration.environment}</TD>
            </tr>
            <tr>
              <TH>
                <FormattedMessage
                  id="opiskelusuunnitelma.assessors"
                  defaultMessage="Näytön arvioijat"
                />
              </TH>
              <TD>{demonstration.assessors.join(", ")}</TD>
            </tr>
          </TBody>
        </Table>
        <InfoContainer>
          {demonstration.assignments.map((assignment, i) => {
            return <li key={i}>{assignment}</li>
          })}
        </InfoContainer>
      </Container>
    )
  }
}
