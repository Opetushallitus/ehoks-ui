import { MobileSlider, Slide } from "components/MobileSlider"
import React from "react"
import { FormattedMessage } from "react-intl"
import { HMediaQuery } from "responsive"
import styled from "styled"
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
import { OsaamisenHankkimistapa } from "models/helpers/TutkinnonOsa"
import { LearningEvent } from "components/StudyInfo/LearningEvent"

const LearningPeriodTitle = styled(Title)`
  margin-left: 20px;
  margin-right: 20px;
`

const LearningPeriodTable = styled(Table)`
  margin-left: 20px;
`

const LearningPeriodTasks = styled(InfoContainer)`
  margin: 10px 20px 20px 10px;
`

const CustomSlider = styled(MobileSlider)`
  margin: 10px 20px 20px 10px;
`

interface LearningPeriodTEMPProps {
  learningPeriodTEMP: OsaamisenHankkimistapa
}

export class LearningPeriodTEMP extends React.Component<
  LearningPeriodTEMPProps
> {
  render() {
    const { learningPeriodTEMP } = this.props
    const {
      alku,
      loppu,
      nimi,
      tyyppi,
      tyopaikallaJarjestettavaKoulutus,
      selite,
      ajanjaksonTarkenne,
      jarjestajanEdustaja
    } = learningPeriodTEMP

    const vastuullinenTyopaikkaOhjaaja =
      tyopaikallaJarjestettavaKoulutus?.vastuullinenTyopaikkaOhjaaja

    const keskeisetTyotehtavat =
      tyopaikallaJarjestettavaKoulutus?.keskeisetTyotehtavat

    const workplaceSelite =
      tyyppi === "WORKPLACE" && tyopaikallaJarjestettavaKoulutus
        ? selite + ", " + tyopaikallaJarjestettavaKoulutus.tyopaikanYTunnus
        : selite

    return (
      <Container data-testid="StudyInfo.LearningPeriod">
        {(alku || loppu) && (
          <LearningPeriodTitle>
            <LearningEvent
              title={
                tyyppi === "OTHER" ? (
                  nimi
                ) : (
                  <FormattedMessage
                    id="opiskelusuunnitelma.tyossaoppiminenTitle"
                    defaultMessage="Työpaikalla oppiminen"
                  />
                )
              }
              type={tyyppi}
              description={tyyppi === "WORKPLACE" ? workplaceSelite : selite}
              startDate={alku}
              endDate={loppu}
              periodSpecifier={ajanjaksonTarkenne}
              size="large"
            />
          </LearningPeriodTitle>
        )}
        <LearningPeriodTable>
          <TBody>
            {tyyppi === "WORKPLACE" && vastuullinenTyopaikkaOhjaaja && (
              <tr>
                <TH>
                  <FormattedMessage
                    id="opiskelusuunnitelma.tyopaikkaohjaajaTitle"
                    defaultMessage="Työpaikkaohjaaja"
                  />
                </TH>
                <TD>
                  {vastuullinenTyopaikkaOhjaaja.nimi}, {selite}
                  <br />
                  {vastuullinenTyopaikkaOhjaaja.sahkoposti}
                </TD>
              </tr>
            )}
            {tyyppi === "WORKPLACE" && vastuullinenTyopaikkaOhjaaja && (
              <tr>
                <TH>
                  <FormattedMessage
                    id="opiskelusuunnitelma.koulutuksenjarjestajanEdustajaTitle"
                    defaultMessage="Koulutuksen järjestäjän edustaja"
                  />
                </TH>
                <TD>{jarjestajanEdustaja.oppilaitosHenkiloDescription}</TD>
              </tr>
            )}
            {keskeisetTyotehtavat.length > 0 && (
              <tr>
                <TH>
                  <FormattedMessage
                    id="opiskelusuunnitelma.keskeisetTyotehtavatTitle"
                    defaultMessage="Keskeiset työtehtävät"
                  />
                </TH>
                <EmptyTD />
              </tr>
            )}
          </TBody>
        </LearningPeriodTable>
        {keskeisetTyotehtavat.length > 0 && (
          <React.Fragment>
            <HMediaQuery.MaxWidth breakpoint="Tablet">
              <CustomSlider>
                {keskeisetTyotehtavat.map((tyotehtava, i) => {
                  return <Slide key={i}>{tyotehtava}</Slide>
                })}
              </CustomSlider>
            </HMediaQuery.MaxWidth>
            <HMediaQuery.MaxWidth breakpoint="Tablet" notMatch>
              <LearningPeriodTasks>
                {keskeisetTyotehtavat.map((tyotehtava, i) => {
                  return <li key={i}>{tyotehtava}</li>
                })}
              </LearningPeriodTasks>
            </HMediaQuery.MaxWidth>
          </React.Fragment>
        )}
      </Container>
    )
  }
}
