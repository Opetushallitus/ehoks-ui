import { Link } from "@reach/router"
import { Icon } from "components/Icon"
import { TitleContainer } from "components/TitleContainer"
import React from "react"
import { GoChevronRight } from "react-icons/go"
import styled from "styled"

const LinkItemContainer = styled("div")`
  display: flex;
  background: #fff;
`

const Title = styled("div")`
  font-size: 18px;
  font-weight: bold;
  color: #000;
`

const SubTitle = styled("div")`
  font-size: 14px;
  color: #ccc;
`

const StyledLink = styled(Link)`
  display: block;
  text-decoration: none;
`

export interface LinkItemProps {
  /** Icon that gets rendered on the left side */
  icon?: React.ReactNode
  /** Item's title */
  title?: string
  /** Item's subtitle */
  subTitle?: string
  /** Custom classname */
  className?: string
  /** Link URI */
  to: string
}

/**
 * List item with link target, title, subtitle and icon
 */
export class LinkItem extends React.Component<LinkItemProps> {
  render() {
    const { className, icon, title, subTitle, to } = this.props
    return (
      <StyledLink className={className} to={to}>
        <LinkItemContainer>
          <Icon>{icon}</Icon>
          <TitleContainer>
            <Title>{title}</Title>
            <SubTitle>{subTitle}</SubTitle>
          </TitleContainer>
          <Icon>
            <GoChevronRight size="24" color="#000" />
          </Icon>
        </LinkItemContainer>
      </StyledLink>
    )
  }
}
