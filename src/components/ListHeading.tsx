import { Icon } from "components/Icon"
import React from "react"
import { GoX } from "react-icons/go"
import styled from "styled"

interface TitleProps {
  titleSize?: "regular" | "large"
}

export const ListHeadingContainer = styled("h1")`
  display: flex;
  align-items: center;
  margin: 0;
  color: #a3a3a3;
`

const Title = styled("div")`
  font-size: ${(props: TitleProps) =>
    props.titleSize === "large" ? "28px" : "22px"};
  flex: 1;
`

export interface ListHeadingProps {
  className?: string
  icon?: React.ReactNode
  titleSize?: "regular" | "large"
  onClose?: () => void
}

export class ListHeading extends React.Component<ListHeadingProps> {
  render() {
    const {
      children,
      className,
      icon,
      titleSize = "regular",
      onClose
    } = this.props
    return (
      <ListHeadingContainer className={className}>
        {icon}
        <Title titleSize={titleSize}>{children}</Title>
        <Icon>
          {onClose ? <GoX size="24" color="#fff" onClick={onClose} /> : null}
        </Icon>
      </ListHeadingContainer>
    )
  }
}
