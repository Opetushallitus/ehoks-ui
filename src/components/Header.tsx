import { Link } from "@reach/router"
import React from "react"
import styled from "react-emotion"
import { GoThreeBars } from "react-icons/go"

const HeaderContainer = styled("div")`
  display: flex;
  height: 64px;
  width: 100%;
  color: #fff;
  align-items: center;
`

const Text = styled("div")`
  font-size: 32px;
  margin-left: 16px;
`

export interface HeaderProps {
  children?: React.ReactNode
}

export class Header extends React.Component<HeaderProps> {
  render() {
    const { children } = this.props
    return (
      <HeaderContainer>
        <Link to="/">
          <GoThreeBars size="48" color="#fff" />
        </Link>
        <Text>{children}</Text>
      </HeaderContainer>
    )
  }
}
