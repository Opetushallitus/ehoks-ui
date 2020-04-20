import React from "react"
import styled from "styled"
import { FormattedDate } from "components/FormattedDate"
import Flag from "components/icons/Flag"
import { MdEventNote } from "react-icons/md"

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
      description
    } = this.props
    const iconSize = size === "small" ? 24 : 32
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
            {periodSpecifier && <Detail size={size}>{periodSpecifier}</Detail>}
            <Detail size={size}>{nayttoymparistoDetails}</Detail>
            <Detail size={size}>{description}</Detail>
          </DetailsContainer>
        </ContentContainer>
      </Container>
    )
  }
}
