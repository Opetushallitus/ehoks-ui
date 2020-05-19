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
  ITarkentavatTiedotOsaamisenArvioija,
  TutkinnonOsaType
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
import { ToggleableItems } from "./TutkinnonOsaHelpers"
import { OsaamisenOsoittaminen } from "./OsaamisenOsoittaminen"
import { CompetenceAquirementTitle } from "./CompetenceAquirementTitle"
import { Table, TBody, TD, TH } from "./Shared"
import { observer } from "mobx-react"

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

const CollapsedDetailsTitle = styled("strong")(
  ({ theme: { spacing } }) => `
  display: block;
  margin: ${spacing.s} 0px ${spacing.xs} 0px;
`
)

const ExpandedDetailsTitle = styled("strong")(
  ({ theme: { spacing } }) => `
  display: block;
  margin: ${spacing.s} 0px ${spacing.xs} ${spacing.l};
`
)

const ArvioijatTable = styled(Table)`
  margin-left: ${props => props.theme.spacing.l};
`

const CollapseIcon = ({
  hasActiveShare,
  toggle,
  intl
}: {
  hasActiveShare: boolean
  toggle: (name: ToggleableItems) => () => void
  intl: InjectedIntl
}) =>
  !hasActiveShare ? (
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
  ) : null

const ExpandIcon = ({
  showExpand,
  toggle,
  intl
}: {
  showExpand: boolean
  toggle: (name: ToggleableItems) => () => void
  intl: InjectedIntl
}) =>
  showExpand ? (
    <IconContainer
      onClick={toggle("details")}
      aria-label={intl.formatMessage({
        id: "opiskelusuunnitelma.naytaTyossaOppiminenAriaLabel"
      })}
      data-testid="TutkinnonOsa.ExpandDetails"
    >
      <Expand size={40} />
    </IconContainer>
  ) : null

const OsaamisenHankkimistavatExpanded = ({
  hasActiveShare,
  fadedColor,
  shareModuleId,
  tutkinnonOsaTyyppi,
  tutkinnonOsaId,
  instructor,
  osaamisenHankkimistavat
}: {
  hasActiveShare: boolean
  fadedColor: string
  shareModuleId?: string
  tutkinnonOsaTyyppi?: TutkinnonOsaType
  tutkinnonOsaId?: string
  instructor?: Instructor
  defaultPeriod?: ShareLinkValidityPeriod
  osaamisenHankkimistavat: IOsaamisenHankkimistapa[]
}) => (
  <>
    {osaamisenHankkimistavat.map((osaamisenHankkimistapa, i) => (
      <ShareDialog
        active={osaamisenHankkimistapa.moduleId === shareModuleId}
        background={fadedColor}
        type={ShareType.osaamisenhankkimistapa}
        moduleId={osaamisenHankkimistapa.moduleId || ""}
        defaultPeriod={{
          start: osaamisenHankkimistapa.alku,
          end: osaamisenHankkimistapa.loppu
        }}
        instructor={instructor}
        tutkinnonOsaTyyppi={tutkinnonOsaTyyppi}
        tutkinnonOsaId={tutkinnonOsaId || ""}
        key={i}
      >
        <OsaamisenHankkimistapa
          key={i}
          osaamisenHankkimistapa={osaamisenHankkimistapa}
          hasActiveShare={hasActiveShare}
          moduleId={osaamisenHankkimistapa.moduleId}
          tutkinnonOsaTyyppi={tutkinnonOsaTyyppi}
          tutkinnonOsaId={tutkinnonOsaId}
        />
      </ShareDialog>
    ))}
  </>
)

const OsaamisenHankkimistavatCollapsed = ({
  osaamisenHankkimistavat
}: {
  osaamisenHankkimistavat: IOsaamisenHankkimistapa[]
}) => (
  <>
    {osaamisenHankkimistavat.map((osaamisenHankkimistapa, i) => (
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
    ))}
  </>
)

const OsaamisenOsoittamisetExpanded = ({
  osaamisenOsoittamiset,
  hasActiveShare,
  fadedColor,
  koodiUri,
  shareModuleId,
  tutkinnonOsaTyyppi,
  tutkinnonOsaId,
  todentamisenProsessi
}: {
  osaamisenOsoittamiset: IOsaamisenOsoittaminen[]
  hasActiveShare: boolean
  fadedColor: string
  koodiUri?: string
  shareModuleId?: string
  tutkinnonOsaTyyppi?: TutkinnonOsaType
  tutkinnonOsaId?: string
  todentamisenProsessi?: TodentamisenProsessi
}) => (
  <>
    {osaamisenOsoittamiset.map((osaamisenOsoittaminen, i) => (
      <ShareDialog
        active={osaamisenOsoittaminen.moduleId === shareModuleId}
        background={fadedColor}
        type={ShareType.osaamisenosoittaminen}
        moduleId={osaamisenOsoittaminen.moduleId || ""}
        defaultPeriod={{
          start: osaamisenOsoittaminen.alku,
          end: osaamisenOsoittaminen.loppu
        }}
        tutkinnonOsaTyyppi={tutkinnonOsaTyyppi}
        tutkinnonOsaId={tutkinnonOsaId || ""}
        key={i}
      >
        <OsaamisenOsoittaminen
          osaamisenOsoittaminen={osaamisenOsoittaminen}
          todentamisenProsessi={todentamisenProsessi}
          koodiUri={koodiUri}
          hasActiveShare={hasActiveShare}
          moduleId={osaamisenOsoittaminen.moduleId}
          tutkinnonOsaTyyppi={tutkinnonOsaTyyppi}
          tutkinnonOsaId={tutkinnonOsaId}
        />
      </ShareDialog>
    ))}
  </>
)

const OsaamisenOsoittamisetCollapsed = ({
  osaamisenOsoittamiset,
  todentamisenProsessiKoodi
}: {
  osaamisenOsoittamiset: IOsaamisenOsoittaminen[]
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
          />
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
            nayttoymparistoDetails={
              osaamisenOsoittaminen?.nayttoymparistoDetails
            }
            startDate={osaamisenOsoittaminen.alku}
            endDate={osaamisenOsoittaminen.loppu}
          />
        </React.Fragment>
      )
    })}
  </>
)

const AiemmanOsaamisenTodentanutOrganisaatioCollapsed = ({
  isAiempiOsaaminen,
  koulutuksenJarjestaja
}: {
  isAiempiOsaaminen: boolean
  koulutuksenJarjestaja?: IOrganisaatio
}) => (
  <CollapsedDetailsTitle>
    <AiemmanOsaamisenTodentanutOrganisaatio
      isAiempiOsaaminen={isAiempiOsaaminen}
      koulutuksenJarjestaja={koulutuksenJarjestaja}
    />
  </CollapsedDetailsTitle>
)

const AiemmanOsaamisenTodentanutOrganisaatioExpanded = ({
  isAiempiOsaaminen,
  koulutuksenJarjestaja
}: {
  isAiempiOsaaminen: boolean
  koulutuksenJarjestaja?: IOrganisaatio
}) => (
  <ExpandedDetailsTitle>
    <AiemmanOsaamisenTodentanutOrganisaatio
      isAiempiOsaaminen={isAiempiOsaaminen}
      koulutuksenJarjestaja={koulutuksenJarjestaja}
    />
  </ExpandedDetailsTitle>
)

const AiemmanOsaamisenTodentanutOrganisaatio = ({
  isAiempiOsaaminen,
  koulutuksenJarjestaja
}: {
  isAiempiOsaaminen: boolean
  koulutuksenJarjestaja?: IOrganisaatio
}) =>
  isAiempiOsaaminen && koulutuksenJarjestaja?.organizationName ? (
    <>
      <FormattedMessage
        id="opiskelusuunnitelma.aiemmanOsaamisenTodentanutTitle"
        defaultMessage="Aiemman osaamisen todentanut"
      />{" "}
      {koulutuksenJarjestaja?.organizationName}
    </>
  ) : null

const TodentamisenProsessiCollapsed = ({
  todentamisenProsessiKoodi,
  todentamisenProsessi
}: {
  todentamisenProsessiKoodi?: string
  todentamisenProsessi?: TodentamisenProsessi
}) => (
  <>
    {todentamisenProsessiKoodi === TodentamisenProsessiKoodi.SUORAAN && (
      <CollapsedDetailsTitle>
        <TodentamisenProsessiSuoraan />
      </CollapsedDetailsTitle>
    )}

    {todentamisenProsessiKoodi ===
      TodentamisenProsessiKoodi.ARVIOIJIEN_KAUTTA && (
      <CollapsedDetailsTitle>
        <TodentamisenProsessiArvioijienKautta
          todentamisenProsessi={todentamisenProsessi}
        />
      </CollapsedDetailsTitle>
    )}
  </>
)

const TodentamisenProsessiExpanded = ({
  todentamisenProsessiKoodi,
  todentamisenProsessi,
  tarkentavatTiedotOsaamisenArvioija
}: {
  todentamisenProsessiKoodi?: string
  todentamisenProsessi?: TodentamisenProsessi
  tarkentavatTiedotOsaamisenArvioija?: ITarkentavatTiedotOsaamisenArvioija
}) => (
  <>
    {todentamisenProsessiKoodi === TodentamisenProsessiKoodi.SUORAAN && (
      <ExpandedDetailsTitle>
        <TodentamisenProsessiSuoraan />
      </ExpandedDetailsTitle>
    )}

    {todentamisenProsessiKoodi ===
      TodentamisenProsessiKoodi.ARVIOIJIEN_KAUTTA && (
      <ExpandedDetailsTitle>
        <TodentamisenProsessiArvioijienKautta
          todentamisenProsessi={todentamisenProsessi}
        />
      </ExpandedDetailsTitle>
    )}

    <AiemminHankitunOsaamisenArvioijat
      tarkentavatTiedotOsaamisenArvioija={tarkentavatTiedotOsaamisenArvioija}
    />
  </>
)

const AiemminHankitunOsaamisenArvioijat = observer(
  ({
    tarkentavatTiedotOsaamisenArvioija
  }: {
    tarkentavatTiedotOsaamisenArvioija?: ITarkentavatTiedotOsaamisenArvioija
  }) => (
    <>
      {!!tarkentavatTiedotOsaamisenArvioija?.aiemminHankitunOsaamisenArvioijat
        .length && (
        <ArvioijatTable>
          <TBody>
            <tr>
              <TH>
                <FormattedMessage
                  id="opiskelusuunnitelma.aiemminHankitunOsaamisenArvioijatTitle"
                  defaultMessage="Arvioijat"
                />
              </TH>
              <TD>
                {tarkentavatTiedotOsaamisenArvioija.aiemminHankitunOsaamisenArvioijat.map(
                  (arvioija, i) => (
                    <span key={i}>
                      {arvioija.koulutuksenJarjestajaArvioijaDescription} <br />
                    </span>
                  )
                )}
              </TD>
            </tr>
          </TBody>
        </ArvioijatTable>
      )}
    </>
  )
)

const TodentamisenProsessiSuoraan = () => (
  <FormattedMessage
    id="opiskelusuunnitelma.osaaminenTunnistettuSuoraanTitle"
    defaultMessage="Osaaminen tunnistettu suoraan"
  />
)

const TodentamisenProsessiArvioijienKautta = ({
  todentamisenProsessi
}: {
  todentamisenProsessi?: TodentamisenProsessi
}) => (
  <FormattedMessage
    id="opiskelusuunnitelma.osaaminenLahetettyArvioitavaksiTitle"
    defaultMessage="Osaaminen lähetetty arvioitavaksi {date}"
    values={{
      date:
        todentamisenProsessi && todentamisenProsessi.lahetettyArvioitavaksi
          ? format(
              parseISO(todentamisenProsessi.lahetettyArvioitavaksi),
              "d.M.yyyy"
            )
          : ""
    }}
  />
)

interface DetailsProps {
  fadedColor?: string
  osaamisenOsoittamiset?: IOsaamisenOsoittaminen[]
  olennainenSeikka?: React.ReactNode
  expanded?: boolean
  koodiUri?: string
  osaamisenHankkimistavat?: IOsaamisenHankkimistapa[]
  share?: {
    type?: ShareType
    moduleId?: string
    tutkinnonOsaTyyppi?: TutkinnonOsaType
    tutkinnonOsaId?: string
  }
  toggle: (name: ToggleableItems) => () => void
  todentamisenProsessi?: TodentamisenProsessi
  koulutuksenJarjestaja?: IOrganisaatio
  tarkentavatTiedotOsaamisenArvioija?: ITarkentavatTiedotOsaamisenArvioija
  moduleId?: string
  tutkinnonOsaTyyppi?: TutkinnonOsaType
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
      moduleId,
      tutkinnonOsaTyyppi,
      toggle,
      todentamisenProsessi,
      koulutuksenJarjestaja,
      tarkentavatTiedotOsaamisenArvioija
    } = this.props
    const { intl } = this.context

    const todentamisenProsessiKoodi =
      todentamisenProsessi && todentamisenProsessi.koodiUri
    const showExpand =
      !!osaamisenOsoittamiset.length ||
      !!osaamisenHankkimistavat.length ||
      todentamisenProsessiKoodi === TodentamisenProsessiKoodi.OHJAUS_NAYTTOON ||
      !!tarkentavatTiedotOsaamisenArvioija
    const isAiempiOsaaminen = !!todentamisenProsessiKoodi
    // TODO hasActiveShare matches now for koodiUri and might show multiple share modals, should use module-id and check per module
    const hasActiveShare = moduleId === share?.tutkinnonOsaId
    const shareType = typeof share !== "undefined" ? share.type : undefined
    const firstOsaamisenHankkimistapa =
      shareType === "osaamisenhankkimistapa" && osaamisenHankkimistavat[0]
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
        data-testid="TutkinnonOsa.DetailsExpanded"
      >
        <DetailsContent>
          <CollapseIcon
            hasActiveShare={hasActiveShare}
            toggle={toggle}
            intl={intl}
          />

          <TodentamisenProsessiExpanded
            todentamisenProsessiKoodi={todentamisenProsessiKoodi}
            todentamisenProsessi={todentamisenProsessi}
            tarkentavatTiedotOsaamisenArvioija={
              tarkentavatTiedotOsaamisenArvioija
            }
          />

          <OsaamisenHankkimistavatExpanded
            hasActiveShare={
              hasActiveShare && shareType === "osaamisenhankkimistapa"
            }
            fadedColor={fadedColor}
            instructor={instructor}
            defaultPeriod={defaultPeriod}
            osaamisenHankkimistavat={osaamisenHankkimistavat}
            tutkinnonOsaTyyppi={tutkinnonOsaTyyppi}
            tutkinnonOsaId={moduleId}
            shareModuleId={share?.moduleId}
          />

          <OsaamisenOsoittamisetExpanded
            osaamisenOsoittamiset={osaamisenOsoittamiset}
            hasActiveShare={
              hasActiveShare && shareType === "osaamisenosoittaminen"
            }
            fadedColor={fadedColor}
            koodiUri={koodiUri}
            shareModuleId={share?.moduleId}
            tutkinnonOsaTyyppi={tutkinnonOsaTyyppi}
            tutkinnonOsaId={moduleId}
            todentamisenProsessi={todentamisenProsessi}
          />

          {olennainenSeikka}

          <AiemmanOsaamisenTodentanutOrganisaatioExpanded
            isAiempiOsaaminen={isAiempiOsaaminen}
            koulutuksenJarjestaja={koulutuksenJarjestaja}
          />
        </DetailsContent>
      </DetailsExpanded>
    ) : (
      <DetailsCollapsed
        fadedColor={fadedColor}
        data-testid="TutkinnonOsa.DetailsCollapsed"
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

            <AiemmanOsaamisenTodentanutOrganisaatioCollapsed
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
