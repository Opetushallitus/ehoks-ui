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
import { LearningEvent } from "components/TutkinnonOsa/LearningEvent"
import { OsaamisenHankkimistapaType } from "../../models/OsaamisenHankkimistapa"
import { observer } from "mobx-react"
import { CompetenceAquirementTitle } from "./CompetenceAquirementTitle"
import { HeroButton } from "components/Button"
import { MdShare } from "react-icons/md"
import { stringifyShareParams } from "utils/shareParams"
import { navigate } from "@reach/router"
import { AppContext } from "components/AppContext"
import { TutkinnonOsaType } from "../../models/helpers/ShareTypes"
import { IKoodistoVastaus } from "models/KoodistoVastaus"

const OsaamisenHankkimistapaTitle = styled(Title)(
  props => `
  display: flex;
  align-items: center;
  margin-left: ${props.theme.spacing.l};
  margin-right: ${props.theme.spacing.l};
`
)

const OsaamisenHankkimistapaTable = styled(Table)`
  margin-left: ${props => props.theme.spacing.l};
`

const OsaamisenHankkimistapaTasks = styled(InfoContainer)`
  margin: 10px 20px 20px 10px;
`

const CustomSlider = styled(MobileSlider)`
  margin: 10px 20px 20px 10px;
`

const ButtonContainer = styled("div")`
  margin-right: ${props => props.theme.spacing.xl};
`

const Button = styled(HeroButton)`
  display: inline-flex;
`

const ShareIcon = styled(MdShare)`
  margin-left: ${props => props.theme.spacing.xs};
`

const FlexLearningEvent = styled(LearningEvent)`
  flex: 1;
`

interface OsaamisenHankkimistapaProps {
  osaamisenHankkimistapa: IOsaamisenHankkimistapa
  moduleId?: string
  hoksEid?: string
  hasActiveShare?: boolean
  tutkinnonOsaTyyppi?: TutkinnonOsaType
  tutkinnonOsaModuleId?: string
  partTimeAmount?: number
  perusta?: IKoodistoVastaus
}

@observer
export class OsaamisenHankkimistapa extends React.Component<
  OsaamisenHankkimistapaProps
> {
  static contextType = AppContext
  declare context: React.ContextType<typeof AppContext>
  share = () => {
    const {
      moduleId,
      hoksEid,
      tutkinnonOsaTyyppi,
      tutkinnonOsaModuleId
    } = this.props
    if (moduleId && hoksEid && tutkinnonOsaTyyppi && tutkinnonOsaModuleId) {
      navigate(
        `${window.location.pathname}?${stringifyShareParams({
          type: "osaamisenhankkimistapa",
          moduleId,
          hoksEid,
          tutkinnonOsaTyyppi,
          tutkinnonOsaModuleId
        })}`
      )
    }
  }

  render() {
    const { osaamisenHankkimistapa, hasActiveShare = false } = this.props
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
      muutOppimisymparistot,
      osaAikaisuustieto,
      oppisopimuksenPerusta,
      keskeytymisajanjaksot
    } = osaamisenHankkimistapa

    const { vastuullinenTyopaikkaOhjaaja, keskeisetTyotehtavat } =
      tyopaikallaJarjestettavaKoulutus || {}

    const { featureFlags } = this.context
    const showShareButton = !hasActiveShare && featureFlags.shareDialog

    return (
      <Container data-testid="TutkinnonOsa.OsaamisenHankkimistapa">
        {(alku || loppu) && (
          <OsaamisenHankkimistapaTitle>
            <FlexLearningEvent
              title={<CompetenceAquirementTitle hankkimistapaType={tyyppi} />}
              description={workplaceSelite}
              startDate={alku}
              endDate={loppu}
              periodSpecifier={ajanjaksonTarkenne}
              size="large"
              partTimeAmount={osaAikaisuustieto}
              osaamisenHankkimistapaTyyppi={
                osaamisenHankkimistapa.osaamisenHankkimistapa
              }
              perusta={oppisopimuksenPerusta}
              keskeytymisajanjaksot={keskeytymisajanjaksot}
            />
            {showShareButton && (
              <ButtonContainer>
                <Button onClick={this.share}>
                  <FormattedMessage
                    id="jakaminen.jaaTiedotButtonTitle"
                    defaultMessage="Jaa nämä tietosi"
                  />
                  <ShareIcon size={24} />
                </Button>
              </ButtonContainer>
            )}
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
                    <br />
                    {vastuullinenTyopaikkaOhjaaja.puhelinnumero}
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
                {keskeisetTyotehtavat.map((tyotehtava, i) => (
                  <Slide key={i}>{tyotehtava}</Slide>
                ))}
              </CustomSlider>
            </HMediaQuery.MaxWidth>
            <HMediaQuery.MaxWidth breakpoint="Tablet" notMatch>
              <OsaamisenHankkimistapaTasks>
                {keskeisetTyotehtavat.map((tyotehtava, i) => (
                  <li key={i}>{tyotehtava}</li>
                ))}
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
