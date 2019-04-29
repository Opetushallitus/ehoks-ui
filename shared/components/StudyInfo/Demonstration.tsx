import { MobileSlider, Slide } from "components/MobileSlider"
import React from "react"
import { FormattedMessage } from "react-intl"
import MediaQuery from "react-responsive"
import styled from "styled"
import { breakpoints } from "theme"
import { Container, InfoContainer, Table, TBody, TD, TH, Title } from "./Shared"
import { Naytto, TodentamisenProsessi } from "models/helpers/TutkinnonOsa"
import { LearningEvent } from "components/StudyInfo/LearningEvent"
import { VerificationProcess } from "types/VerificationProcess"

const DemonstrationTitle = styled(Title)`
  margin-left: 20px;
  margin-right: 20px;
`

const DemonstrationTable = styled(Table)`
  margin-left: 20px;
`

const DemonstrationTasks = styled(InfoContainer)`
  margin: 10px 20px 20px 10px;
`

const CustomSlider = styled(MobileSlider)`
  margin: 10px 20px 20px 10px;
`

interface DemonstrationProps {
  demonstration: Naytto
  verificationProcess?: TodentamisenProsessi
}

export class Demonstration extends React.Component<DemonstrationProps> {
  render() {
    const { demonstration, verificationProcess } = this.props
    const title =
      verificationProcess &&
      verificationProcess.koodiUri === VerificationProcess.OHJAUS_NAYTTOON ? (
        <FormattedMessage
          id="opiskelusuunnitelma.osaaminenOsoitetaanNaytossaTitle"
          defaultMessage="Osaaminen osoitetaan näytössä"
        />
      ) : (
        <FormattedMessage
          id="opiskelusuunnitelma.nayttoTitle"
          defaultMessage="Näyttö"
        />
      )
    return (
      <Container data-testid="StudyInfo.Demonstration">
        <DemonstrationTitle>
          <LearningEvent
            title={title}
            type={demonstration.tyyppi}
            description={demonstration.organisaatio}
            startDate={demonstration.alku}
            endDate={demonstration.loppu}
            size="large"
          />
        </DemonstrationTitle>
        <DemonstrationTable>
          <TBody>
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
                  demonstration.koulutuksenJarjestajaArvioijat &&
                  demonstration.koulutuksenJarjestajaArvioijat.map(
                    (arvioija, i) => (
                      <span key={i}>
                        {arvioija} <br />
                      </span>
                    )
                  )}
                {demonstration &&
                  demonstration.tyoelamaArvioijat &&
                  demonstration.tyoelamaArvioijat.map((arvioija, i) => (
                    <span key={i}>
                      {arvioija} <br />
                    </span>
                  ))}
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
                <DemonstrationTasks>
                  {demonstration &&
                    demonstration.tyotehtavat &&
                    demonstration.tyotehtavat.map((tyotehtava, i) => {
                      return <li key={i}>{tyotehtava}</li>
                    })}
                </DemonstrationTasks>
              )
            }
          }}
        </MediaQuery>
      </Container>
    )
  }
}
