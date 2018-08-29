import { Link, LinkProps } from "@reach/router"
import React from "react"
import styled, { css } from "react-emotion"
import { GoChevronRight } from "react-icons/go"

const LinkItemContainer = styled("div")`
  display: flex;
  background: #fff;
`

const Content = styled("div")`
  flex: 1;
  flex-direction: column;
  display: flex;
  margin: 10px 0;
`

const Icon = styled("div")`
  display: flex;
  margin: 0 16px;
  align-items: center;
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

export interface LinkItemProps extends LinkProps<{}> {
  icon?: React.ReactNode
  title?: string
  subTitle?: string
  className?: string
}

export class LinkItem extends React.Component<LinkItemProps> {
  render() {
    const { className, icon, title, subTitle, to } = this.props
    return (
      <Link className={css`${linkStyles}${className}`} to={to}>
        <LinkItemContainer>
          <Icon>{icon}</Icon>
          <Content>
            <Title>{title}</Title>
            <SubTitle>{subTitle}</SubTitle>
          </Content>
          <Icon>
            <GoChevronRight size="24" color="#000" />
          </Icon>
        </LinkItemContainer>
      </Link>
    )
  }
}
