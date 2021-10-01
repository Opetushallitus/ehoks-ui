import React from "react"
import { FormattedMessage } from "react-intl"
import styled from "styled"
import { FormattedDate } from "components/FormattedDate"
import Flag from "components/icons/Flag"
import { MdEventNote } from "react-icons/md"
import { InfoModal } from "components/InfoModal"
import { IKoodistoVastaus } from "models/KoodistoVastaus"
import { IKeskeytymisajanjakso } from "models/Keskeytymisajanjakso"

interface SizeProps {
  size?: "small" | "large"
}

const Container = styled("div")`
  display: flex;
  flex-direction: column;
`

const ContentContainer = styled("div")`
  display: flex;
`

interface IconProps {
  isOsaamisenOsoittaminen: boolean
}
const Icon = styled("div")<IconProps>`
  margin-right: 10px;
  padding-top: ${props => (props.isOsaamisenOsoittaminen ? "7px" : "3px")};
  color: ${props => (props.isOsaamisenOsoittaminen ? "#636769" : "#000")};
`

const DetailsContainer = styled("div")`
  flex: 1;
  flex-direction: column;
`

const Detail = styled("div")<SizeProps>`
  font-weight: 600;
  color: #636769;
  line-height: ${props => (props.size === "small" ? "inherit" : "1.6")};
`

const Title = styled("strong")<SizeProps>`
  display: block;
  margin: 10px 0 8px 0;
`

interface LearningEventProps {
  className?: string
  title?: React.ReactNode
  isOsaamisenOsoittaminen?: boolean
  size?: "small" | "large"
  nayttoymparistoDetails?: string
  startDate?: string
  endDate?: string
  periodSpecifier?: string
  description?: string
  partTimeAmount?: number
  perusta?: IKoodistoVastaus
  keskeytymisajanjaksot?: IKeskeytymisajanjakso[]
}

export class LearningEvent extends React.Component<LearningEventProps> {
  render() {
    const {
      className,
      title,
      size = "small",
      nayttoymparistoDetails,
      startDate = "",
      endDate = "",
      periodSpecifier = "",
      isOsaamisenOsoittaminen = false,
      description,
      partTimeAmount,
      perusta,
      keskeytymisajanjaksot
    } = this.props
    const iconSize = size === "small" ? 24 : 32
    const keskeytynyt = !!(keskeytymisajanjaksot || []).find(k => !k.loppu)
    return (
      <Container className={className} data-testid="TutkinnonOsa.LearningEvent">
        <Title size={size}>{title}</Title>
        <ContentContainer>
          <Icon isOsaamisenOsoittaminen={isOsaamisenOsoittaminen}>
            {isOsaamisenOsoittaminen ? (
              <Flag size={iconSize} />
            ) : (
              <MdEventNote size={iconSize} fill="#636769" />
            )}
          </Icon>
          <DetailsContainer>
            <div style={{ display: "inline-block", width: "auto" }}>
              {startDate === endDate ? (
                <Detail size={size}>
                  <FormattedDate date={startDate} dateNotSet="" />
                </Detail>
              ) : (
                <Detail size={size}>
                  <FormattedDate date={startDate} dateNotSet="" />
                  {" - "}
                  <FormattedDate date={endDate} dateNotSet="" />
                </Detail>
              )}
            </div>
            {(partTimeAmount ||
              (perusta && perusta.nimi) ||
              keskeytymisajanjaksot) && (
              <div style={{ display: "inline-block", marginLeft: 5 }}>
                <InfoModal
                  nayttoymparistoDetails={nayttoymparistoDetails}
                  startDate={startDate}
                  endDate={endDate}
                  partTimeAmount={partTimeAmount}
                  perusta={perusta}
                  keskeytymisajanjaksot={keskeytymisajanjaksot}
                />
              </div>
            )}
            {periodSpecifier && <Detail size={size}>{periodSpecifier}</Detail>}
            <Detail size={size}>{nayttoymparistoDetails}</Detail>
            <Detail size={size}>{description}</Detail>
            {keskeytynyt && (
              <Detail size={size}>
                <FormattedMessage
                  id="learningEvent.keskeytynyt"
                  defaultMessage="Keskeytynyt"
                />
              </Detail>
            )}
          </DetailsContainer>
        </ContentContainer>
      </Container>
    )
  }
}
