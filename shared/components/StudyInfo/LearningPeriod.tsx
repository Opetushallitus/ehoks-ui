import { MobileSlider, Slide } from "components/MobileSlider"
import React from "react"
import { FormattedMessage } from "react-intl"
import MediaQuery from "react-responsive"
import styled from "styled"
import { breakpoints } from "theme"
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
import { Harjoittelujakso, JarjestajanEdustaja, OsaamisenHankkimistapa } from "models/helpers/TutkinnonOsa"
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

interface LearningPeriodProps {
  learningPeriod: Harjoittelujakso
  competenceAcquiringMethods?: Array<OsaamisenHankkimistapa>
  organizer?: JarjestajanEdustaja
}

export class LearningPeriod extends React.Component<LearningPeriodProps> {
  render() {
    const { learningPeriod, competenceAcquiringMethods, organizer } = this.props
    const {
      tyotehtavat = [],
      alku,
      loppu,
      nimi,
      tyyppi,
      ohjaaja,
      selite
    } = learningPeriod

    const method = competenceAcquiringMethods ? competenceAcquiringMethods[0] : undefined
    const workplaceSelite = tyyppi === "WORKPLACE" && method && method.tyopaikallaJarjestettavaKoulutus ?
        selite + ", " + method.tyopaikallaJarjestettavaKoulutus.tyopaikanYTunnus :
        selite
    const periodSpecifier = method && method.ajanjaksonTarkenne ? method.ajanjaksonTarkenne : ""
    const organizerRepresentative = organizer && organizer.nimi ? organizer.nimi : ""
    const organizerOrganisation = organizer && organizer.oppilaitosNimi ? organizer.oppilaitosNimi : ""
    console.log("OrganizerRepresentative")
    console.log(organizerRepresentative)
    console.log("Organizer")
    console.log(organizer)
    console.log("OrganizerOrganisation")
    console.log(organizerOrganisation)

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
              periodSpecifier={periodSpecifier}
              size="large"
            />
          </LearningPeriodTitle>
        )}
        <LearningPeriodTable>
          <TBody>
            {tyyppi === "WORKPLACE" && ohjaaja && (
              <tr>
                <TH>
                  <FormattedMessage
                    id="opiskelusuunnitelma.tyopaikkaohjaajaTitle"
                    defaultMessage="Työpaikkaohjaaja"
                  />
                </TH>
                <TD>
                  {ohjaaja.nimi}, {selite}<br/>
                  {ohjaaja.sahkoposti}
                </TD>
              </tr>
            )}
            {tyyppi === "WORKPLACE" && ohjaaja && (
                <tr>
                  <TH>
                    <FormattedMessage
                        id="opiskelusuunnitelma.koulutuksenjarjestajanEdustajaTitle"
                        defaultMessage="Koulutuksen järjestäjän edustaja"
                    />
                  </TH>
                  <TD>
                    {organizerRepresentative}, {organizerOrganisation}
                  </TD>
                </tr>
            )}
            {tyotehtavat.length > 0 && (
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
        {tyotehtavat.length > 0 && (
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
                  <LearningPeriodTasks>
                    {tyotehtavat.map((tyotehtava, i) => {
                      return <li key={i}>{tyotehtava}</li>
                    })}
                  </LearningPeriodTasks>
                )
              }
            }}
          </MediaQuery>
        )}
      </Container>
    )
  }
}
