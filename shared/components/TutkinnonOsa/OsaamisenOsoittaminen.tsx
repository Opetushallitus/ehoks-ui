import { MobileSlider, Slide } from "components/MobileSlider"
import React, { useState, useContext } from "react"
import { FormattedMessage } from "react-intl"
import { HMediaQuery } from "responsive"
import styled from "styled"
import { Container, InfoContainer, Table, TBody, TD, TH, Title } from "./Shared"
import {
  IOsaamisenOsoittaminen,
  TodentamisenProsessi
} from "models/helpers/TutkinnonOsa"
import { LearningEvent } from "components/TutkinnonOsa/LearningEvent"
import { TodentamisenProsessiKoodi } from "types/TodentamisenProsessiKoodi"
import { HeroButton } from "components/Button"
import { MdShare } from "react-icons/md"
import { useNavigate } from "react-router"
import { stringifyShareParams } from "utils/shareParams"
import { AppContext } from "components/AppContext"
import { RequirementsAndDeviations } from "./RequirementsAndDeviations"
import { observer } from "mobx-react"
import { ShareType, TutkinnonOsaType } from "../../models/helpers/ShareTypes"

const OsaamisenOsoittaminenTitle = styled(Title)(
  (props) => `
  display: flex;
  align-items: center;
  margin-left: ${props.theme.spacing.l};
  margin-right: ${props.theme.spacing.l};
`
)

const FlexLearningEvent = styled(LearningEvent)`
  flex: 1;
`

const OsaamisenOsoittaminenTable = styled(Table)`
  margin-left: ${(props) => props.theme.spacing.l};
`

const OsaamisenOsoittaminenTasks = styled(InfoContainer)(
  ({ theme: { spacing } }) => `
  margin: ${spacing.s} ${spacing.l} ${spacing.l} ${spacing.l};
`
)

const CustomSlider = styled(MobileSlider)(
  ({ theme: { spacing } }) => `
  margin: ${spacing.s} ${spacing.l} ${spacing.l} ${spacing.s};
`
)

const ButtonContainer = styled("div")`
  margin-right: ${(props) => props.theme.spacing.xl};
`

const Button = styled(HeroButton)`
  display: inline-flex;
`

const ShareIcon = styled(MdShare)`
  margin-left: ${(props) => props.theme.spacing.xs};
`

const DemonstrationTasksTitle = styled("h3")`
  margin-left: ${(props) => props.theme.spacing.l};
  ${(props) => props.theme.typography.heading4}
`

interface OsaamisenOsoittaminenState {
  requirementsAndDeviationsExpanded: boolean
}

interface OsaamisenOsoittaminenProps {
  osaamisenOsoittaminen: IOsaamisenOsoittaminen
  todentamisenProsessi?: TodentamisenProsessi
  moduleId?: string
  hoksEid?: string
  koodiUri?: string
  hasActiveShare?: boolean
  tutkinnonOsaTyyppi?: TutkinnonOsaType
  tutkinnonOsaModuleId?: string
}

export const OsaamisenOsoittaminen = observer(
  (props: OsaamisenOsoittaminenProps) => {
    const navigate = useNavigate()
    const [state, setState] = useState<OsaamisenOsoittaminenState>({
      requirementsAndDeviationsExpanded: false
    })

    const toggleRequirementsAndDeviations = () => {
      setState({
        requirementsAndDeviationsExpanded:
          !state.requirementsAndDeviationsExpanded
      })
    }

    const share = () => {
      const { moduleId, hoksEid, tutkinnonOsaTyyppi, tutkinnonOsaModuleId } =
        props
      if (moduleId && hoksEid && tutkinnonOsaTyyppi && tutkinnonOsaModuleId) {
        navigate(
          `${window.location.pathname}?${stringifyShareParams({
            type: ShareType.osaamisenosoittaminen,
            moduleId,
            hoksEid,
            tutkinnonOsaTyyppi,
            tutkinnonOsaModuleId
          })}`
        )
      }
    }

    const {
      osaamisenOsoittaminen,
      hasActiveShare = false,
      todentamisenProsessi
    } = props
    const { featureFlags } = useContext(AppContext)
    const { requirementsAndDeviationsExpanded } = state

    const title =
      todentamisenProsessi &&
      todentamisenProsessi.koodiUri ===
        TodentamisenProsessiKoodi.OHJAUS_NAYTTOON ? (
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
      sisallonKuvaus,
      osaAlueet
    } = osaamisenOsoittaminen

    const jarjestajaOppilaitos = jarjestaja.oppilaitosNimi

    return (
      <Container data-testid="TutkinnonOsa.OsaamisenOsoittaminen">
        <OsaamisenOsoittaminenTitle>
          <FlexLearningEvent
            title={title}
            isOsaamisenOsoittaminen={true}
            nayttoymparistoDetails={
              osaamisenOsoittaminen.nayttoymparistoDetails
            }
            startDate={osaamisenOsoittaminen.alku}
            endDate={osaamisenOsoittaminen.loppu}
            size="large"
            description={nayttoymparisto.kuvaus}
          />
          {showShareButton && (
            <ButtonContainer>
              <Button onClick={share}>
                <FormattedMessage
                  id="jakaminen.jaaTiedotButtonTitle"
                  defaultMessage="Jaa nämä tietosi"
                />
                <ShareIcon size={24} />
              </Button>
            </ButtonContainer>
          )}
        </OsaamisenOsoittaminenTitle>
        <OsaamisenOsoittaminenTable>
          <TBody>
            {osaAlueet.length > 0 && (
              <tr>
                <TH>
                  <FormattedMessage
                    id="opiskelusuunnitelma.liittyvatTutkinnonOsat"
                    defaultMessage="Muut tutkinnon osat"
                  />
                </TH>
                <TD>
                  {osaAlueet.map((osaAlue, i) => (
                    <span key={i}>
                      {osaAlue.osaAlueData.nimi} <br />
                    </span>
                  ))}
                </TD>
              </tr>
            )}
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
        </OsaamisenOsoittaminenTable>
        <DemonstrationTasksTitle>
          <FormattedMessage
            id="opiskelusuunnitelma.sisaltoTitle"
            defaultMessage="Sisältö"
          />
        </DemonstrationTasksTitle>
        <HMediaQuery.MaxWidth breakpoint="Tablet">
          <CustomSlider>
            {sisallonKuvaus.map((tyotehtava, i) => (
              <Slide key={i}>{tyotehtava}</Slide>
            ))}
          </CustomSlider>
        </HMediaQuery.MaxWidth>
        <HMediaQuery.MaxWidth breakpoint="Tablet" notMatch>
          <OsaamisenOsoittaminenTasks>
            {sisallonKuvaus.map((tyotehtava, i) => (
              <li key={i}>{tyotehtava}</li>
            ))}
          </OsaamisenOsoittaminenTasks>
        </HMediaQuery.MaxWidth>

        <RequirementsAndDeviations
          toggle={toggleRequirementsAndDeviations}
          expanded={requirementsAndDeviationsExpanded}
          requirements={osaamisenOsoittaminen.yksilollisetKriteerit}
          deviations={
            osaamisenOsoittaminen.vaatimuksistaTaiTavoitteistaPoikkeaminen
          }
        />
      </Container>
    )
  }
)
