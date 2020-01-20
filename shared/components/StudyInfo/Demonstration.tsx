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
import { HeroButton } from "components/Button"
import { MdShare } from "react-icons/md"
import { navigate } from "@reach/router"
import { stringifyShareParams } from "utils/shareParams"
import { AppContext } from "components/AppContext"
import { RequirementsAndDeviations } from "./RequirementsAndDeviations"

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
  demonstration: Naytto
  verificationProcess?: TodentamisenProsessi
  koodiUri?: string
  hasActiveShare?: boolean
  shareProps?: { tyyppi?: string; uuid?: string | "" }
}

export class Demonstration extends React.Component<
  DemonstrationProps,
  DemonstrationState
  > {
  static contextType = AppContext
  context!: React.ContextType<typeof AppContext>

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
          type: "naytto",
          uuid: ""
        })}`
      )
    }
  }

  render() {
    const {
      demonstration,
      hasActiveShare = false,
      verificationProcess,
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

    return (
      <Container data-testid="StudyInfo.Demonstration">
        <DemonstrationTitle>
          <FlexLearningEvent
            title={title}
            type={demonstration.tyyppi}
            description={demonstration.organisaatio}
            startDate={demonstration.alku}
            endDate={demonstration.loppu}
            size="large"
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
