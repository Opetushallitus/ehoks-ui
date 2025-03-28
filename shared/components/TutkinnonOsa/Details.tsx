import React from "react"
import { useIntl, FormattedMessage } from "react-intl"
import styled from "styled"
import { Collapse } from "./Collapse"
import { Expand } from "./Expand"
import { IconContainer } from "./IconContainer"
import { OsaamisenHankkimistapa } from "./OsaamisenHankkimistapa"
import {
  IOrganisaatio,
  IOsaamisenHankkimistapa,
  IOsaamisenOsoittaminen,
  ITarkentavatTiedotOsaamisenArvioija,
  TodentamisenProsessi
} from "models/helpers/TutkinnonOsa"
import { LearningEvent } from "./LearningEvent"
import { TodentamisenProsessiKoodi } from "types/TodentamisenProsessiKoodi"
import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
import ShareDialog, {
  Instructor,
  ShareLinkValidityPeriod
} from "components/ShareDialog"
import { OsaamisenOsoittaminen } from "./OsaamisenOsoittaminen"
import { CompetenceAquirementTitle } from "./CompetenceAquirementTitle"
import { Table, TBody, TD, TH } from "./Shared"
import { observer } from "mobx-react"
import { ShareType, TutkinnonOsaType } from "../../models/helpers/ShareTypes"

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
  toggle
}: {
  hasActiveShare: boolean
  toggle: () => void
}) => {
  const intl = useIntl()
  return !hasActiveShare ? (
    <LocationsContainerExpanded>
      <IconContainer
        onClick={toggle}
        aria-label={intl.formatMessage({
          id: "opiskelusuunnitelma.piilotaTyossaOppiminenAriaLabel"
        })}
      >
        <Collapse size={40} />
      </IconContainer>
    </LocationsContainerExpanded>
  ) : null
}

const ExpandIcon = ({
  showExpand,
  toggle
}: {
  showExpand: boolean
  toggle: () => void
}) => {
  const intl = useIntl()
  return showExpand ? (
    <IconContainer
      onClick={toggle}
      aria-label={intl.formatMessage({
        id: "opiskelusuunnitelma.naytaTyossaOppiminenAriaLabel"
      })}
      data-testid="TutkinnonOsa.ExpandDetails"
    >
      <Expand size={40} />
    </IconContainer>
  ) : null
}

const OsaamisenHankkimistavatExpanded = ({
  fadedColor,
  shareModuleId,
  hoksEid,
  tutkinnonOsaTyyppi,
  tutkinnonOsaModuleId,
  instructor,
  osaamisenHankkimistavat
}: {
  fadedColor: string
  shareModuleId?: string
  hoksEid?: string
  tutkinnonOsaTyyppi?: TutkinnonOsaType
  tutkinnonOsaModuleId?: string
  instructor?: Instructor
  defaultPeriod?: ShareLinkValidityPeriod
  osaamisenHankkimistavat: IOsaamisenHankkimistapa[]
}) => (
  <>
    {osaamisenHankkimistavat.map((osaamisenHankkimistapa, i) => (
      <ShareDialog
        active={osaamisenHankkimistapa.moduleId === shareModuleId}
        background={fadedColor}
        type={ShareType.osaamisenhankkiminen}
        moduleId={osaamisenHankkimistapa.moduleId || ""}
        hoksEid={hoksEid || ""}
        defaultPeriod={{
          start: osaamisenHankkimistapa.alku,
          end: osaamisenHankkimistapa.loppu
        }}
        instructor={instructor}
        tutkinnonOsaTyyppi={tutkinnonOsaTyyppi}
        tutkinnonOsaModuleId={tutkinnonOsaModuleId || ""}
        key={i}
      >
        <OsaamisenHankkimistapa
          key={i}
          osaamisenHankkimistapa={osaamisenHankkimistapa}
          hasActiveShare={osaamisenHankkimistapa.moduleId === shareModuleId}
          moduleId={osaamisenHankkimistapa.moduleId}
          tutkinnonOsaTyyppi={tutkinnonOsaTyyppi}
          tutkinnonOsaModuleId={tutkinnonOsaModuleId}
          hoksEid={hoksEid}
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
        partTimeAmount={osaamisenHankkimistapa.osaAikaisuustieto}
        osaamisenHankkimistapaKoodisto={
          osaamisenHankkimistapa.osaamisenHankkimistapa
        }
        osaamisenHankkimistapaTyyppi={osaamisenHankkimistapa.tyyppi}
        perusta={osaamisenHankkimistapa.oppisopimuksenPerusta}
        keskeytymisajanjaksot={osaamisenHankkimistapa.keskeytymisajanjaksot}
      />
    ))}
  </>
)

const OsaamisenOsoittamisetExpanded = ({
  osaamisenOsoittamiset,
  fadedColor,
  koodiUri,
  shareModuleId,
  hoksEid,
  tutkinnonOsaTyyppi,
  tutkinnonOsaModuleId,
  todentamisenProsessi
}: {
  osaamisenOsoittamiset: IOsaamisenOsoittaminen[]
  fadedColor: string
  koodiUri?: string
  shareModuleId?: string
  hoksEid?: string
  tutkinnonOsaTyyppi?: TutkinnonOsaType
  tutkinnonOsaModuleId?: string
  todentamisenProsessi?: TodentamisenProsessi
}) => (
  <>
    {osaamisenOsoittamiset.map((osaamisenOsoittaminen, i) => (
      <ShareDialog
        active={osaamisenOsoittaminen.moduleId === shareModuleId}
        background={fadedColor}
        type={ShareType.osaamisenosoittaminen}
        moduleId={osaamisenOsoittaminen.moduleId || ""}
        hoksEid={hoksEid || ""}
        defaultPeriod={{
          start: osaamisenOsoittaminen.alku,
          end: osaamisenOsoittaminen.loppu
        }}
        tutkinnonOsaTyyppi={tutkinnonOsaTyyppi}
        tutkinnonOsaModuleId={tutkinnonOsaModuleId || ""}
        key={i}
      >
        <OsaamisenOsoittaminen
          osaamisenOsoittaminen={osaamisenOsoittaminen}
          todentamisenProsessi={todentamisenProsessi}
          koodiUri={koodiUri}
          hasActiveShare={osaamisenOsoittaminen.moduleId === shareModuleId}
          moduleId={osaamisenOsoittaminen.moduleId}
          hoksEid={hoksEid || ""}
          tutkinnonOsaTyyppi={tutkinnonOsaTyyppi}
          tutkinnonOsaModuleId={tutkinnonOsaModuleId}
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
}) =>
  koulutuksenJarjestaja ? (
    <ExpandedDetailsTitle>
      <AiemmanOsaamisenTodentanutOrganisaatio
        isAiempiOsaaminen={isAiempiOsaaminen}
        koulutuksenJarjestaja={koulutuksenJarjestaja}
      />
    </ExpandedDetailsTitle>
  ) : null

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
    tutkinnonOsaModuleId?: string
    hoksEid?: string
  }
  toggle: () => void
  todentamisenProsessi?: TodentamisenProsessi
  koulutuksenJarjestaja?: IOrganisaatio
  tarkentavatTiedotOsaamisenArvioija?: ITarkentavatTiedotOsaamisenArvioija
  moduleId?: string
  tutkinnonOsaTyyppi?: TutkinnonOsaType
  hoksEid?: string
}

export const Details = (props: DetailsProps) => {
  const {
    osaamisenOsoittamiset = [],
    olennainenSeikka,
    expanded,
    fadedColor = "",
    koodiUri,
    osaamisenHankkimistavat = [],
    share,
    hoksEid,
    moduleId,
    tutkinnonOsaTyyppi,
    toggle,
    todentamisenProsessi,
    koulutuksenJarjestaja,
    tarkentavatTiedotOsaamisenArvioija
  } = props

  const todentamisenProsessiKoodi =
    todentamisenProsessi && todentamisenProsessi.koodiUri
  const showExpand =
    !!osaamisenOsoittamiset.length ||
    !!osaamisenHankkimistavat.length ||
    todentamisenProsessiKoodi === TodentamisenProsessiKoodi.OHJAUS_NAYTTOON ||
    !!tarkentavatTiedotOsaamisenArvioija
  const isAiempiOsaaminen = !!todentamisenProsessiKoodi
  // TODO hasActiveShare matches now for koodiUri and might show multiple share modals, should use module-id and check per module
  const hasActiveShare = moduleId === share?.moduleId
  const shareType = typeof share !== "undefined" ? share.type : undefined
  const firstOsaamisenHankkimistapa =
    shareType === ShareType.osaamisenhankkiminen && osaamisenHankkimistavat[0]
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
        <CollapseIcon hasActiveShare={hasActiveShare} toggle={toggle} />

        <TodentamisenProsessiExpanded
          todentamisenProsessiKoodi={todentamisenProsessiKoodi}
          todentamisenProsessi={todentamisenProsessi}
          tarkentavatTiedotOsaamisenArvioija={
            tarkentavatTiedotOsaamisenArvioija
          }
        />

        <OsaamisenHankkimistavatExpanded
          fadedColor={fadedColor}
          instructor={instructor}
          defaultPeriod={defaultPeriod}
          osaamisenHankkimistavat={osaamisenHankkimistavat}
          tutkinnonOsaTyyppi={tutkinnonOsaTyyppi}
          tutkinnonOsaModuleId={moduleId}
          shareModuleId={share?.moduleId}
          hoksEid={hoksEid}
        />

        <OsaamisenOsoittamisetExpanded
          osaamisenOsoittamiset={osaamisenOsoittamiset}
          fadedColor={fadedColor}
          koodiUri={koodiUri}
          shareModuleId={share?.moduleId}
          hoksEid={hoksEid}
          tutkinnonOsaTyyppi={tutkinnonOsaTyyppi}
          tutkinnonOsaModuleId={moduleId}
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

        <ExpandIcon showExpand={showExpand} toggle={toggle} />
      </LocationsContainer>
    </DetailsCollapsed>
  )
}
