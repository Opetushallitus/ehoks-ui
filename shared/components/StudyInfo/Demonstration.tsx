import { MobileSlider, Slide } from "components/MobileSlider"
import React from "react"
import { FormattedMessage } from "react-intl"
import { HMediaQuery } from "responsive"
import styled from "styled"
import { Container, InfoContainer, Table, TBody, TD, TH, Title } from "./Shared"
import {
  IOsaamisenOsoittaminen,
  TodentamisenProsessi
} from "models/helpers/TutkinnonOsa"
import { LearningEvent } from "components/StudyInfo/LearningEvent"
import { VerificationProcess } from "types/VerificationProcess"
import { HeroButton } from "components/Button"
import { MdShare } from "react-icons/md"
import { navigate } from "@reach/router"
import { stringifyShareParams } from "utils/shareParams"
import { AppContext } from "components/AppContext"
import { RequirementsAndDeviations } from "./RequirementsAndDeviations"
import { observer } from "mobx-react"

const DemonstrationTitle = styled(Title)`
  display: flex;
  align-items: center;
  margin-left: 20px;
  margin-right: 20px;
`

const FlexLearningEvent = styled(LearningEvent)`
  flex: 1;
`

const DemonstrationTable = styled(Table)`
  margin-left: 20px;
`

const DemonstrationTasks = styled(InfoContainer)`
  margin: 10px 20px 20px 20px;
`

const CustomSlider = styled(MobileSlider)`
  margin: 10px 20px 20px 10px;
`

const ButtonContainer = styled("div")`
  margin-right: 50px;
`

const Button = styled(HeroButton)`
  display: inline-flex;
`

const ShareIcon = styled(MdShare)`
  margin-left: 6px;
`

interface DemonstrationState {
  requirementsAndDeviationsExpanded: boolean
}

interface DemonstrationProps {
  demonstration: IOsaamisenOsoittaminen
  verificationProcess?: TodentamisenProsessi
  koodiUri?: string
  hasActiveShare?: boolean
}

@observer
export class Demonstration extends React.Component<
  DemonstrationProps,
  DemonstrationState
> {
  static contextType = AppContext
  declare context: React.ContextType<typeof AppContext>

  state: DemonstrationState = {
    requirementsAndDeviationsExpanded: false
  }

  toggleRequirementsAndDeviations = () => {
    this.setState(state => ({
      requirementsAndDeviationsExpanded: !state.requirementsAndDeviationsExpanded
    }))
  }

  share = () => {
    const { koodiUri } = this.props
    if (koodiUri) {
      navigate(
        `${window.location.pathname}?${stringifyShareParams({
          share: koodiUri,
          type: "naytto"
        })}`
      )
    }
  }

  render() {
    const {
      demonstration,
      hasActiveShare = false,
      verificationProcess
    } = this.props
    const { featureFlags } = this.context
    const { requirementsAndDeviationsExpanded } = this.state

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

    const showShareButton = !hasActiveShare && featureFlags.shareDialog

    const {
      nayttoymparisto,
      koulutuksenJarjestajaArvioijat,
      tyoelamaArvioijat,
      jarjestaja,
      sisallonKuvaus
    } = demonstration

    const jarjestajaOppilaitos = jarjestaja.oppilaitosNimi

    return (
      <Container data-testid="StudyInfo.Demonstration">
        <DemonstrationTitle>
          <FlexLearningEvent
            title={title}
            isDemonstration={true}
            description={nayttoymparisto.nimi}
            startDate={demonstration.alku}
            endDate={demonstration.loppu}
            size="large"
            demonstrationEnviromentDescription={nayttoymparisto.kuvaus}
          />
          {showShareButton && (
            <ButtonContainer>
              <Button onClick={this.share}>
                <FormattedMessage
                  id="jakaminen.jaaNaytonTiedotButtonTitle"
                  defaultMessage="Näytön tietojen jakaminen"
                />
                <ShareIcon size={24} />
              </Button>
            </ButtonContainer>
          )}
        </DemonstrationTitle>
        <DemonstrationTable>
          <TBody>
            <tr>
              <TH>
                <FormattedMessage
                  id="opiskelusuunnitelma.arvioijatTitle"
                  defaultMessage="Näytön arvioijat"
                />
              </TH>
              <TD>
                {koulutuksenJarjestajaArvioijat.map((arvioija, i) => (
                  <span key={i}>
                    {arvioija} <br />
                  </span>
                ))}
                {tyoelamaArvioijat.map((arvioija, i) => (
                  <span key={i}>
                    {arvioija} <br />
                  </span>
                ))}
              </TD>
            </tr>
            {jarjestajaOppilaitos ? (
              <tr>
                <TH>
                  <FormattedMessage
                    id="opiskelusuunnitelma.jarjestajaTitle"
                    defaultMessage="Järjestäjä"
                  />
                </TH>
                <TD>{jarjestajaOppilaitos}</TD>
              </tr>
            ) : null}
          </TBody>
        </DemonstrationTable>
        <HMediaQuery.MaxWidth breakpoint="Tablet">
          <CustomSlider>
            {sisallonKuvaus.map((tyotehtava, i) => {
              return <Slide key={i}>{tyotehtava}</Slide>
            })}
          </CustomSlider>
        </HMediaQuery.MaxWidth>
        <HMediaQuery.MaxWidth breakpoint="Tablet" notMatch>
          <DemonstrationTasks>
            {sisallonKuvaus.map((tyotehtava, i) => {
              return <li key={i}>{tyotehtava}</li>
            })}
          </DemonstrationTasks>
        </HMediaQuery.MaxWidth>

        <RequirementsAndDeviations
          toggle={this.toggleRequirementsAndDeviations}
          expanded={requirementsAndDeviationsExpanded}
          requirements={demonstration.yksilollisetKriteerit}
          deviations={demonstration.vaatimuksistaTaiTavoitteistaPoikkeaminen}
        />
      </Container>
    )
  }
}
