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
import { IOsaamisenHankkimistapa } from "models/helpers/TutkinnonOsa"
import { LearningEvent } from "components/StudyInfo/LearningEvent"
import { OsaamisenHankkimistapaType } from "../../models/OsaamisenHankkimistapa"
import { observer } from "mobx-react"

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

interface LearningPeriodProps {
  learningPeriod: IOsaamisenHankkimistapa
}

@observer
export class LearningPeriod extends React.Component<LearningPeriodProps> {
  render() {
    const { learningPeriod } = this.props
    const {
      alku,
      loppu,
      tyyppi,
      tyopaikallaJarjestettavaKoulutus,
      selite,
      workplaceSelite,
      ajanjaksonTarkenne,
      jarjestajanEdustaja,
      muutOppimisymparistot
    } = learningPeriod

    const vastuullinenTyopaikkaOhjaaja =
      tyopaikallaJarjestettavaKoulutus?.vastuullinenTyopaikkaOhjaaja

    const keskeisetTyotehtavat =
      tyopaikallaJarjestettavaKoulutus?.keskeisetTyotehtavat

    return (
      <Container data-testid="StudyInfo.LearningPeriod">
        {(alku || loppu) && (
          <LearningPeriodTitle>
            <LearningEvent
              title={
                tyyppi === OsaamisenHankkimistapaType.Workplace ? (
                  <FormattedMessage
                    id="opiskelusuunnitelma.tyossaoppiminenTitle"
                    defaultMessage="Työpaikalla oppiminen"
                  />
                ) : (
                  ""
                )
              }
              description={
                tyyppi === OsaamisenHankkimistapaType.Workplace
                  ? workplaceSelite
                  : selite
              }
              startDate={alku}
              endDate={loppu}
              periodSpecifier={ajanjaksonTarkenne}
              size="large"
            />
          </LearningPeriodTitle>
        )}
        <LearningPeriodTable>
          <TBody>
            {tyyppi === OsaamisenHankkimistapaType.Workplace &&
              vastuullinenTyopaikkaOhjaaja && (
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
            {tyyppi === OsaamisenHankkimistapaType.Workplace &&
              vastuullinenTyopaikkaOhjaaja && (
                <tr>
                  <TH>
                    <FormattedMessage
                      id="opiskelusuunnitelma.koulutuksenjarjestajanEdustajaTitle"
                      defaultMessage="Koulutuksen järjestäjän edustaja"
                    />
                  </TH>
                  <TD>{jarjestajanEdustaja?.oppilaitosHenkiloDescription}</TD>
                </tr>
              )}
            {keskeisetTyotehtavat?.length > 0 && (
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
        {keskeisetTyotehtavat?.length > 0 && (
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

        {muutOppimisymparistot.map((environment, i) => {
          const nimi =
            environment.oppimisymparisto && environment.oppimisymparisto.nimi
              ? environment.oppimisymparisto.nimi
              : ""

          return (
            <LearningPeriodTitle key={i}>
              <LearningEvent
                title={nimi}
                startDate={environment.alku}
                endDate={environment.loppu}
                size="large"
              />
            </LearningPeriodTitle>
          )
        })}
      </Container>
    )
  }
}
