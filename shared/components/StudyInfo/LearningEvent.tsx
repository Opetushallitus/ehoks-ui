import React from "react"
import styled from "styled"
import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
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
  pad: boolean
}
const Icon = styled("div")<IconProps>`
  margin-right: 10px;
  padding-top: ${props => (props.pad ? "7px" : "3px")};
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
  title?: React.ReactNode
  type: "WORKPLACE" | "OTHER" | "DEMONSTRATION"
  size?: "small" | "large"
  description?: string
  startDate?: string
  endDate?: string
}

export class LearningEvent extends React.Component<LearningEventProps> {
  render() {
    const {
      title,
      size = "small",
      description,
      startDate = "",
      endDate = "",
      type
    } = this.props
    const color = "#636769"
    const iconSize = size === "small" ? 24 : 32
    return (
      <Container>
        <Title size={size}>{title}</Title>
        <ContentContainer>
          <Icon pad={type === "DEMONSTRATION"}>
            {type === "DEMONSTRATION" ? (
              <Flag size={iconSize} color={color} />
            ) : (
              <MdEventNote size={iconSize} fill={color} />
            )}
          </Icon>
          <DetailsContainer>
            <Detail size={size}>
              {format(parseISO(startDate), "d.M.")}
              {" - "}
              {format(parseISO(endDate), "d.M.yyyy")}
            </Detail>
            <Detail size={size}>{description}</Detail>
          </DetailsContainer>
        </ContentContainer>
      </Container>
    )
  }
}
