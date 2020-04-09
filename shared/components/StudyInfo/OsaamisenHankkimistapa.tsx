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
import { CompetenceAquirementTitle } from "./CompetenceAquirementTitle"

const OsaamisenHankkimistapaTitle = styled(Title)`
  margin-left: 20px;
  margin-right: 20px;
`

const OsaamisenHankkimistapaTable = styled(Table)`
  margin-left: 20px;
`

const OsaamisenHankkimistapaTasks = styled(InfoContainer)`
  margin: 10px 20px 20px 10px;
`

const CustomSlider = styled(MobileSlider)`
  margin: 10px 20px 20px 10px;
`

interface OsaamisenHankkimistapaProps {
  osaamisenHankkimistapa: IOsaamisenHankkimistapa
}

@observer
export class OsaamisenHankkimistapa extends React.Component<
  OsaamisenHankkimistapaProps
> {
  render() {
    const { osaamisenHankkimistapa } = this.props
    const {
      alku,
      loppu,
      tyyppi,
      tyopaikallaJarjestettavaKoulutus,
      selite,
      workplaceSelite,
      ajanjaksonTarkenne,
      jarjestajanEdustaja,
      hankkijanEdustaja,
      muutOppimisymparistot
    } = osaamisenHankkimistapa

    const { vastuullinenTyopaikkaOhjaaja, keskeisetTyotehtavat } =
      tyopaikallaJarjestettavaKoulutus || {}

    return (
      <Container data-testid="StudyInfo.OsaamisenHankkimistapa">
        {(alku || loppu) && (
          <OsaamisenHankkimistapaTitle>
            <LearningEvent
              title={<CompetenceAquirementTitle hankkimistapaType={tyyppi} />}
              description={workplaceSelite}
              startDate={alku}
              endDate={loppu}
              periodSpecifier={ajanjaksonTarkenne}
              size="large"
            />
          </OsaamisenHankkimistapaTitle>
        )}
        <OsaamisenHankkimistapaTable>
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
                    {[vastuullinenTyopaikkaOhjaaja.nimi, selite]
                      .filter(Boolean)
                      .join(", ")}
                    <br />
                    {vastuullinenTyopaikkaOhjaaja.sahkoposti}
                  </TD>
                </tr>
              )}
            {tyyppi === OsaamisenHankkimistapaType.Workplace &&
              jarjestajanEdustaja && (
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
            {hankkijanEdustaja && (
              <tr>
                <TH>
                  <FormattedMessage
                    id="opiskelusuunnitelma.hankkijanEdustajaTitle"
                    defaultMessage="Hankkivan koulutuksen järjestäjän edustaja"
                  />
                </TH>
                <TD>{hankkijanEdustaja.oppilaitosHenkiloDescription}</TD>
              </tr>
            )}
            {!!keskeisetTyotehtavat?.length && (
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
        </OsaamisenHankkimistapaTable>
        {!!keskeisetTyotehtavat?.length && (
          <React.Fragment>
            <HMediaQuery.MaxWidth breakpoint="Tablet">
              <CustomSlider>
                {keskeisetTyotehtavat.map((tyotehtava, i) => <Slide key={i}>{tyotehtava}</Slide>)}
              </CustomSlider>
            </HMediaQuery.MaxWidth>
            <HMediaQuery.MaxWidth breakpoint="Tablet" notMatch>
              <OsaamisenHankkimistapaTasks>
                {keskeisetTyotehtavat.map((tyotehtava, i) => <li key={i}>{tyotehtava}</li>)}
              </OsaamisenHankkimistapaTasks>
            </HMediaQuery.MaxWidth>
          </React.Fragment>
        )}
        {muutOppimisymparistot.map((environment, i) => (
            <OsaamisenHankkimistapaTitle key={i}>
              <LearningEvent
                title={environment.oppimisymparisto.nimi}
                startDate={environment.alku}
                endDate={environment.loppu}
                size="large"
              />
            </OsaamisenHankkimistapaTitle>
          ))}
      </Container>
    )
  }
}
