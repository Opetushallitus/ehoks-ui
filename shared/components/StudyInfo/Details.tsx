import React from "react"
import { intlShape, FormattedMessage, InjectedIntl } from "react-intl"
import styled from "styled"
import { Collapse } from "./Collapse"
import { Expand } from "./Expand"
import { IconContainer } from "./IconContainer"
import { OsaamisenHankkimistapa } from "./OsaamisenHankkimistapa"
import {
  IOsaamisenHankkimistapa,
  IOsaamisenOsoittaminen,
  TodentamisenProsessi,
  IOrganisaatio,
  ITarkentavatTiedotOsaamisenArvioija
} from "models/helpers/TutkinnonOsa"
import { LearningEvent } from "./LearningEvent"
import { TodentamisenProsessiKoodi } from "types/TodentamisenProsessiKoodi"
import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
import { ShareType } from "stores/NotificationStore"
import ShareDialog, {
  Instructor,
  ShareLinkValidityPeriod
} from "components/ShareDialog"
import { ToggleableItems } from "./StudyInfoHelpers"
import { OsaamisenOsoittaminen } from "./OsaamisenOsoittaminen"
import { CompetenceAquirementTitle } from "./CompetenceAquirementTitle"

interface ColorProps {
  fadedColor: string
}

const DetailsCollapsed = styled("div")`
  display: flex;
  flex-direction: row;
  height: 100%;
  padding: 10px 10px 20px 20px;
  justify-content: space-between;
  background: ${(props: ColorProps) => props.fadedColor};
  border-top: 1px solid #c9cdcf;
`

const DetailsExpanded = styled(DetailsCollapsed)`
  background: ${(props: ColorProps) => props.fadedColor};
  padding: 0;
  border-top: 1px solid #c9cdcf;
`

const DetailsContent = styled("div")`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`

const LocationsContainer = styled("div")`
  display: flex;
  flex: 1;
  align-items: flex-start;
  justify-content: flex-end;
`

const LocationsContainerExpanded = styled("div")`
  display: inline-block;
  position: absolute;
  right: 0;
  padding-top: 10px;
  padding-right: 14px;
`

const TodentamisenProsessiTitle = styled("strong")`
  display: block;
  margin: 10px 0 8px 0;
`

const TodentamisenProsessiTitleExpanded = styled("strong")`
  display: block;
  margin: 10px 0 8px 20px;
`

const CollapseIcon = ({
  hasActiveShare,
  toggle,
  intl
}: {
  hasActiveShare: boolean
  toggle: (name: ToggleableItems) => () => void
  intl: InjectedIntl
}) => (
  <>
    {!hasActiveShare && (
      <LocationsContainerExpanded>
        <IconContainer
          onClick={toggle("details")}
          aria-label={intl.formatMessage({
            id: "opiskelusuunnitelma.piilotaTyossaOppiminenAriaLabel"
          })}
        >
          <Collapse size={40} />
        </IconContainer>
      </LocationsContainerExpanded>
    )}
  </>
)

const ExpandIcon = ({
  showExpand,
  toggle,
  intl
}: {
  showExpand: boolean
  toggle: (name: ToggleableItems) => () => void
  intl: InjectedIntl
}) => (
  <>
    {showExpand && (
      <IconContainer
        onClick={toggle("details")}
        aria-label={intl.formatMessage({
          id: "opiskelusuunnitelma.naytaTyossaOppiminenAriaLabel"
        })}
        data-testid="StudyInfo.ExpandDetails"
      >
        <Expand size={40} />
      </IconContainer>
    )}
  </>
)

const OsaamisenHankkimistavatExpanded = ({
  hasActiveShare,
  shareType,
  fadedColor,
  koodiUri,
  instructor,
  defaultPeriod,
  osaamisenHankkimistavat
}: {
  hasActiveShare: boolean
  shareType?: ShareType | ""
  fadedColor: string
  koodiUri?: string
  instructor?: Instructor
  defaultPeriod?: ShareLinkValidityPeriod
  osaamisenHankkimistavat: Array<IOsaamisenHankkimistapa>
}) => (
  <ShareDialog
    active={hasActiveShare && shareType === "tyossaoppiminen"}
    background={fadedColor}
    koodiUri={koodiUri || ""}
    type="tyossaoppiminen"
    instructor={instructor}
    defaultPeriod={defaultPeriod}
  >
    {osaamisenHankkimistavat.map((osaamisenHankkimistapa, i) => {
      return (
        <OsaamisenHankkimistapa
          key={i}
          osaamisenHankkimistapa={osaamisenHankkimistapa}
        />
      )
    })}
  </ShareDialog>
)

const OsaamisenHankkimistavatCollapsed = ({
  osaamisenHankkimistavat
}: {
  osaamisenHankkimistavat: Array<IOsaamisenHankkimistapa>
}) => (
  <>
    {osaamisenHankkimistavat.map((osaamisenHankkimistapa, i) => {
      return (
        <LearningEvent
          key={i}
          title={
            <CompetenceAquirementTitle
              hankkimistapaType={osaamisenHankkimistapa.tyyppi}
            />
          }
          description={osaamisenHankkimistapa.selite}
          startDate={osaamisenHankkimistapa.alku}
          endDate={osaamisenHankkimistapa.loppu}
        />
      )
    })}
  </>
)

const OsaamisenOsoittamisetExpanded = ({
  osaamisenOsoittamiset,
  hasActiveShare,
  shareType,
  fadedColor,
  koodiUri,
  todentamisenProsessi
}: {
  osaamisenOsoittamiset: Array<IOsaamisenOsoittaminen>
  hasActiveShare: boolean
  shareType?: ShareType | ""
  fadedColor: string
  koodiUri?: string
  todentamisenProsessi?: TodentamisenProsessi
}) => (
  <>
    {osaamisenOsoittamiset.map((osaamisenOsoittaminen, i) => {
      return (
        <ShareDialog
          active={hasActiveShare && shareType === "naytto"}
          background={fadedColor}
          koodiUri={koodiUri || ""}
          type="naytto"
          defaultPeriod={{
            start: osaamisenOsoittaminen.alku,
            end: osaamisenOsoittaminen.loppu
          }}
          key={i}
        >
          <OsaamisenOsoittaminen
            osaamisenOsoittaminen={osaamisenOsoittaminen}
            todentamisenProsessi={todentamisenProsessi}
            koodiUri={koodiUri}
            hasActiveShare={hasActiveShare && shareType === "naytto"}
          />
        </ShareDialog>
      )
    })}
  </>
)

const OsaamisenOsoittamisetCollapsed = ({
  osaamisenOsoittamiset,
  todentamisenProsessiKoodi
}: {
  osaamisenOsoittamiset: Array<IOsaamisenOsoittaminen>
  todentamisenProsessiKoodi?: string
}) => (
  <>
    {osaamisenOsoittamiset.map((osaamisenOsoittaminen, i) => {
      const title =
        todentamisenProsessiKoodi ===
        TodentamisenProsessiKoodi.OHJAUS_NAYTTOON ? (
          <FormattedMessage
            id="opiskelusuunnitelma.osaaminenOsoitetaanNaytossaTitle"
            defaultMessage="Osaaminen osoitetaan näytössä"
          >
            {msg => (
              <span data-testid="StudyInfo.DemonstrationVerification">
                {msg}
              </span>
            )}
          </FormattedMessage>
        ) : (
          <FormattedMessage
            id="opiskelusuunnitelma.nayttoTitle"
            defaultMessage="Näyttö"
          />
        )
      return (
        <React.Fragment key={i}>
          <LearningEvent
            title={title}
            description={osaamisenOsoittaminen?.nayttoymparisto?.nimi}
            startDate={osaamisenOsoittaminen.alku}
            endDate={osaamisenOsoittaminen.loppu}
          />
        </React.Fragment>
      )
    })}
  </>
)

const AiemmanOsaamisenTodentanutOrganisaatio = ({
  isAiempiOsaaminen,
  koulutuksenJarjestaja
}: {
  isAiempiOsaaminen: boolean
  koulutuksenJarjestaja?: IOrganisaatio
}) => (
  <>
    {isAiempiOsaaminen && (
      <TodentamisenProsessiTitleExpanded data-testid="StudyInfo.AssessmentVerificationOrganisation">
        <FormattedMessage
          id="opiskelusuunnitelma.aiemmanOsaamisenTodentanutTitle"
          defaultMessage="Aiemman osaamisen todentanut"
        />{" "}
        {koulutuksenJarjestaja?.organizationName}
      </TodentamisenProsessiTitleExpanded>
    )}
  </>
)

const TodentamisenProsessiCollapsed = ({
  todentamisenProsessiKoodi,
  todentamisenProsessi
}: {
  todentamisenProsessiKoodi?: string
  todentamisenProsessi?: TodentamisenProsessi
}) => (
  <>
    <TodentamisenProsessiSuoraan
      todentamisenProsessiKoodi={todentamisenProsessiKoodi}
    />

    <TodentamisenProsessiArvioijienKautta
      todentamisenProsessiKoodi={todentamisenProsessiKoodi}
      todentamisenProsessi={todentamisenProsessi}
    />
  </>
)

const TodentamisenProsessiSuoraan = ({
  todentamisenProsessiKoodi
}: {
  todentamisenProsessiKoodi?: string
}) => (
  <>
    {todentamisenProsessiKoodi === TodentamisenProsessiKoodi.SUORAAN && (
      <React.Fragment>
        <TodentamisenProsessiTitle>
          <FormattedMessage
            id="opiskelusuunnitelma.osaaminenTunnistettuSuoraanTitle"
            defaultMessage="Osaaminen tunnistettu suoraan"
          />
        </TodentamisenProsessiTitle>
      </React.Fragment>
    )}
  </>
)

const TodentamisenProsessiArvioijienKautta = ({
  todentamisenProsessiKoodi,
  todentamisenProsessi
}: {
  todentamisenProsessiKoodi?: string
  todentamisenProsessi?: TodentamisenProsessi
}) => (
  <>
    {todentamisenProsessiKoodi ===
      TodentamisenProsessiKoodi.ARVIOIJIEN_KAUTTA && (
      <TodentamisenProsessiTitle data-testid="StudyInfo.AssessmentVerification">
        <FormattedMessage
          id="opiskelusuunnitelma.osaaminenLahetettyArvioitavaksiTitle"
          defaultMessage="Osaaminen lähetetty arvioitavaksi {date}"
          values={{
            date:
              todentamisenProsessi &&
              todentamisenProsessi.lahetettyArvioitavaksi
                ? format(
                    parseISO(todentamisenProsessi.lahetettyArvioitavaksi),
                    "d.M.yyyy"
                  )
                : ""
          }}
        />
      </TodentamisenProsessiTitle>
    )}
  </>
)

interface DetailsProps {
  fadedColor?: string
  osaamisenOsoittamiset?: Array<IOsaamisenOsoittaminen>
  olennainenSeikka?: React.ReactNode
  expanded?: boolean
  koodiUri?: string
  osaamisenHankkimistavat?: Array<IOsaamisenHankkimistapa>
  share?: { koodiUri: string; type: ShareType | "" }
  toggle: (name: ToggleableItems) => () => void
  todentamisenProsessi?: TodentamisenProsessi
  koulutuksenJarjestaja?: IOrganisaatio
  tarkentavatTiedotOsaamisenArvioija?: ITarkentavatTiedotOsaamisenArvioija
}

export class Details extends React.Component<DetailsProps> {
  static contextTypes = {
    intl: intlShape
  }

  render() {
    const {
      osaamisenOsoittamiset = [],
      olennainenSeikka,
      expanded,
      fadedColor = "",
      koodiUri,
      osaamisenHankkimistavat = [],
      share,
      toggle,
      todentamisenProsessi,
      koulutuksenJarjestaja
    } = this.props
    const { intl } = this.context

    const todentamisenProsessiKoodi =
      todentamisenProsessi && todentamisenProsessi.koodiUri
    const showExpand =
      !!osaamisenOsoittamiset.length ||
      !!osaamisenHankkimistavat.length ||
      todentamisenProsessiKoodi === TodentamisenProsessiKoodi.OHJAUS_NAYTTOON
    const isAiempiOsaaminen = !!todentamisenProsessiKoodi
    const hasActiveShare =
      typeof share !== "undefined" && koodiUri === share.koodiUri
    const shareType = typeof share !== "undefined" ? share.type : undefined
    const firstOsaamisenHankkimistapa =
      shareType === "tyossaoppiminen" && osaamisenHankkimistavat[0]
        ? osaamisenHankkimistavat[0]
        : undefined

    const instructor = firstOsaamisenHankkimistapa
      ? {
          name: firstOsaamisenHankkimistapa.ohjaaja
            ? firstOsaamisenHankkimistapa.ohjaaja.nimi || ""
            : "",
          email: firstOsaamisenHankkimistapa.ohjaaja
            ? firstOsaamisenHankkimistapa.ohjaaja.sahkoposti || ""
            : "",
          organisation: firstOsaamisenHankkimistapa.selite
        }
      : undefined
    const defaultPeriod = firstOsaamisenHankkimistapa
      ? {
          start: firstOsaamisenHankkimistapa.alku,
          end: firstOsaamisenHankkimistapa.loppu
        }
      : undefined

    return expanded ? (
      <DetailsExpanded
        fadedColor={fadedColor}
        data-testid="StudyInfo.DetailsExpanded"
      >
        <DetailsContent>
          <CollapseIcon
            hasActiveShare={hasActiveShare}
            toggle={toggle}
            intl={intl}
          />

          <OsaamisenHankkimistavatExpanded
            hasActiveShare={hasActiveShare}
            shareType={shareType}
            fadedColor={fadedColor}
            koodiUri={koodiUri}
            instructor={instructor}
            defaultPeriod={defaultPeriod}
            osaamisenHankkimistavat={osaamisenHankkimistavat}
          />

          <OsaamisenOsoittamisetExpanded
            osaamisenOsoittamiset={osaamisenOsoittamiset}
            hasActiveShare={hasActiveShare}
            shareType={shareType}
            fadedColor={fadedColor}
            koodiUri={koodiUri}
            todentamisenProsessi={todentamisenProsessi}
          />

          {olennainenSeikka}

          <AiemmanOsaamisenTodentanutOrganisaatio
            isAiempiOsaaminen={isAiempiOsaaminen}
            koulutuksenJarjestaja={koulutuksenJarjestaja}
          />
        </DetailsContent>
      </DetailsExpanded>
    ) : (
      <DetailsCollapsed
        fadedColor={fadedColor}
        data-testid="StudyInfo.DetailsCollapsed"
      >
        <LocationsContainer>
          <DetailsContent>
            <TodentamisenProsessiCollapsed
              todentamisenProsessiKoodi={todentamisenProsessiKoodi}
              todentamisenProsessi={todentamisenProsessi}
            />

            <OsaamisenHankkimistavatCollapsed
              osaamisenHankkimistavat={osaamisenHankkimistavat}
            />

            <OsaamisenOsoittamisetCollapsed
              osaamisenOsoittamiset={osaamisenOsoittamiset}
              todentamisenProsessiKoodi={todentamisenProsessiKoodi}
            />

            <AiemmanOsaamisenTodentanutOrganisaatio
              isAiempiOsaaminen={isAiempiOsaaminen}
              koulutuksenJarjestaja={koulutuksenJarjestaja}
            />
          </DetailsContent>

          <ExpandIcon showExpand={showExpand} toggle={toggle} intl={intl} />
        </LocationsContainer>
      </DetailsCollapsed>
    )
  }
}
