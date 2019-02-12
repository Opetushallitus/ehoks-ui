import { MobileSlider, Slide } from "components/MobileSlider"
import React from "react"
import { FormattedMessage } from "react-intl"
import MediaQuery from "react-responsive"
import styled from "styled"
import { breakpoints } from "theme"
import { DemonstrationDates } from "./DemonstrationDates"
import { Container, InfoContainer, Table, TBody, TD, TH, Title } from "./Shared"
import { SnapshotOrInstance } from "mobx-state-tree"
import { Naytto } from "models/Naytto"

const DemonstrationTitle = styled(Title)`
  padding-left: 20px;
`

const DemonstrationTable = styled(Table)`
  margin-left: 20px;
`

const CustomSlider = styled(MobileSlider)`
  margin: 10px 0 0 0;
  border-left: 0;
  border-right: 0;
`

interface DemonstrationProps {
  accentColor?: string
  demonstration: SnapshotOrInstance<typeof Naytto>
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
              <TD>{demonstration.organisaatio}</TD>
            </tr>
            <tr>
              <TH>
                <FormattedMessage
                  id="opiskelusuunnitelma.nayttoymparistoTitle"
                  defaultMessage="Näyttöympäristö"
                />
              </TH>
              <TD>{demonstration.ymparisto}</TD>
            </tr>
            <tr>
              <TH>
                <FormattedMessage
                  id="opiskelusuunnitelma.arvioijatTitle"
                  defaultMessage="Näytön arvioijat"
                />
              </TH>
              <TD>
                {demonstration &&
                  demonstration.arvioijat &&
                  demonstration.arvioijat.join(", ")}
              </TD>
            </tr>
          </TBody>
        </DemonstrationTable>
        <MediaQuery maxWidth={breakpoints.Tablet}>
          {matches => {
            if (matches) {
              return (
                <CustomSlider>
                  {demonstration &&
                    demonstration.tyotehtavat &&
                    demonstration.tyotehtavat.map((tyotehtava, i) => {
                      return <Slide key={i}>{tyotehtava}</Slide>
                    })}
                </CustomSlider>
              )
            } else {
              return (
                <InfoContainer>
                  {demonstration &&
                    demonstration.tyotehtavat &&
                    demonstration.tyotehtavat.map((tyotehtava, i) => {
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
