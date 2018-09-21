import { Link } from "@reach/router"
import { Icon } from "components/Icon"
import { TitleContainer } from "components/TitleContainer"
import React from "react"
import styled, { css } from "react-emotion"
import { GoChevronRight } from "react-icons/go"

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

const linkStyles = css`
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
  to?: string
}

/**
 * List item with link target, title, subtitle and icon
 */
export class LinkItem extends React.Component<LinkItemProps> {
  render() {
    const { className, icon, title, subTitle, to } = this.props
    return (
      <Link className={css`${linkStyles}${className}`} to={to}>
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
      </Link>
    )
  }
}
