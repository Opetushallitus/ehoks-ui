import React from "react"
import { intlShape, FormattedMessage } from "react-intl"
import styled from "styled"
import { Collapse } from "./Collapse"
import { Expand } from "./Expand"
import { IconContainer } from "./IconContainer"
import { LearningPeriod } from "./LearningPeriod"
import { OtherPeriod } from "./OtherPeriod"
import {
  MuuOppimisymparisto,
  Naytto,
  IOsaamisenHankkimistapa,
  IOsaamisenOsoittaminen,
  TodentamisenProsessi
} from "models/helpers/TutkinnonOsa"
import { LearningEvent } from "./LearningEvent"
import { VerificationProcess } from "types/VerificationProcess"
import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
import { ShareType } from "stores/NotificationStore"
import ShareDialog from "components/ShareDialog"
import { ToggleableItems } from "./StudyInfoHelpers"
import { OsaamisenHankkimistapaType } from "../../models/OsaamisenHankkimistapa"
import { DemonstrationTEMP } from "./Demonstration"

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

const VerificationTitle = styled("strong")`
  display: block;
  margin: 10px 0 8px 0;
`

interface DetailsProps {
  fadedColor?: string
  demonstrations?: Array<Naytto>
  demonstrationsTEMP?: Array<IOsaamisenOsoittaminen>
  extraContent?: React.ReactNode
  expanded?: boolean
  koodiUri?: string
  learningPeriods?: Array<IOsaamisenHankkimistapa>
  share?: { koodiUri: string; type: ShareType | "" }
  toggle: (name: ToggleableItems) => () => void
  verificationProcess?: TodentamisenProsessi
}

export class Details extends React.Component<DetailsProps> {
  static contextTypes = {
    intl: intlShape
  }

  render() {
    const {
      demonstrationsTEMP = [],
      extraContent = null,
      expanded,
      fadedColor = "",
      koodiUri,
      learningPeriods = [],
      share,
      toggle,
      verificationProcess
    } = this.props
    const { intl } = this.context

    const verification = verificationProcess && verificationProcess.koodiUri
    const { SUORAAN, ARVIOIJIEN_KAUTTA, OHJAUS_NAYTTOON } = VerificationProcess
    const showExpand =
      demonstrationsTEMP.length ||
      learningPeriods.length ||
      verification === OHJAUS_NAYTTOON
    const hasActiveShare =
      typeof share !== "undefined" && koodiUri === share.koodiUri
    const shareType = typeof share !== "undefined" ? share.type : undefined
    const firstLearningPeriod =
      shareType === "tyossaoppiminen" && learningPeriods[0]
        ? learningPeriods[0]
        : undefined

    const instructor = firstLearningPeriod
      ? {
          name: firstLearningPeriod.ohjaaja
            ? firstLearningPeriod.ohjaaja.nimi || ""
            : "",
          email: firstLearningPeriod.ohjaaja
            ? firstLearningPeriod.ohjaaja.sahkoposti || ""
            : "",
          organisation: firstLearningPeriod.selite
        }
      : undefined
    const defaultPeriod = firstLearningPeriod
      ? { start: firstLearningPeriod.alku, end: firstLearningPeriod.loppu }
      : undefined

    let otherPeriods: MuuOppimisymparisto[] = []
    learningPeriods
      .filter(method => !!method.muutOppimisymparistot)
      .map(method => {
        method?.muutOppimisymparistot?.map(ymparisto =>
          otherPeriods.push(ymparisto)
        )
      })

    return expanded ? (
      <DetailsExpanded
        fadedColor={fadedColor}
        data-testid="StudyInfo.DetailsExpanded"
      >
        <DetailsContent>
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

          <ShareDialog
            active={hasActiveShare && shareType === "tyossaoppiminen"}
            background={fadedColor}
            koodiUri={koodiUri || ""}
            type="tyossaoppiminen"
            instructor={instructor}
            defaultPeriod={defaultPeriod}
          >
            {learningPeriods.map((period, i) => {
              return <LearningPeriod key={i} learningPeriod={period} />
            })}
          </ShareDialog>

          {otherPeriods.map((period, i) => {
            return <OtherPeriod key={i} otherPeriod={period} />
          })}

          {demonstrationsTEMP.map((demonstration, i) => {
            return (
              <ShareDialog
                active={hasActiveShare && shareType === "naytto"}
                background={fadedColor}
                koodiUri={koodiUri || ""}
                type="naytto"
                defaultPeriod={{
                  start: demonstration.alku,
                  end: demonstration.loppu
                }}
                key={i}
              >
                <DemonstrationTEMP
                  demonstrationTEMP={demonstration}
                  verificationProcess={verificationProcess}
                  koodiUri={koodiUri}
                  hasActiveShare={hasActiveShare && shareType === "naytto"}
                />
              </ShareDialog>
            )
          })}

          {extraContent}
        </DetailsContent>
      </DetailsExpanded>
    ) : (
      <DetailsCollapsed
        fadedColor={fadedColor}
        data-testid="StudyInfo.DetailsCollapsed"
      >
        <LocationsContainer>
          <DetailsContent>
            {verification === SUORAAN && (
              <VerificationTitle data-testid="StudyInfo.DirectVerification">
                <FormattedMessage
                  id="opiskelusuunnitelma.osaaminenTunnistettuSuoraanTitle"
                  defaultMessage="Osaaminen tunnistettu suoraan"
                />
              </VerificationTitle>
            )}
            {verification === ARVIOIJIEN_KAUTTA && (
              <VerificationTitle data-testid="StudyInfo.AssessmentVerification">
                <FormattedMessage
                  id="opiskelusuunnitelma.osaaminenLahetettyArvioitavaksiTitle"
                  defaultMessage="Osaaminen lähetetty arvioitavaksi {date}"
                  values={{
                    date:
                      verificationProcess &&
                      verificationProcess.lahetettyArvioitavaksi
                        ? format(
                            parseISO(
                              verificationProcess.lahetettyArvioitavaksi
                            ),
                            "d.M.yyyy"
                          )
                        : ""
                  }}
                />
              </VerificationTitle>
            )}
            {learningPeriods.map((lp, i) => {
              return (
                <LearningEvent
                  key={i}
                  title={
                    lp.tyyppi === OsaamisenHankkimistapaType.Other ? (
                      lp.nimi
                    ) : (
                      <FormattedMessage
                        id="opiskelusuunnitelma.tyossaoppiminenTitle"
                        defaultMessage="Työpaikalla oppiminen"
                      />
                    )
                  }
                  description={lp.selite}
                  startDate={lp.alku}
                  endDate={lp.loppu}
                />
              )
            })}
            {demonstrationsTEMP.map((d, i) => {
              const title =
                verification === OHJAUS_NAYTTOON ? (
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
                <LearningEvent
                  key={i}
                  title={title}
                  description={d?.nayttoymparisto?.nimi}
                  startDate={d.alku}
                  endDate={d.loppu}
                />
              )
            })}
          </DetailsContent>
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
        </LocationsContainer>
      </DetailsCollapsed>
    )
  }
}
