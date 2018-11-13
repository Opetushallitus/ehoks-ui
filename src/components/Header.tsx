import { Link } from "@reach/router"
import { inject, observer } from "mobx-react"
import React from "react"
import { GoThreeBars } from "react-icons/go"
import { IRootStore } from "stores/RootStore"
import styled from "styled"

const HeaderContainer = styled("div")`
  display: flex;
  height: 64px;
  width: 100%;
  color: #fff;
  background-color: ${props => props.theme.colors.header.background};
  align-items: center;
`

const Text = styled("div")`
  font-size: 32px;
  margin-left: 16px;
  flex: 1;
`

const LoginContainer = styled("div")`
  margin: 0 10px;
`

const StyledLink = styled(Link)`
  color: #fff;
  text-decoration: none;
`

const User = styled("div")`
  font-weight: bold;
`

export interface HeaderProps {
  children?: React.ReactNode
  store?: IRootStore
}

@inject("store")
@observer
export class Header extends React.Component<HeaderProps> {
  logout = (event: React.MouseEvent) => {
    event.preventDefault()
    this.props.store!.session.logout()
  }

  login = (event: React.MouseEvent) => {
    event.preventDefault()
    window.location.href = this.props.store!.environment.opintopolkuLoginUrl
  }

  render() {
    const { children, store } = this.props
    return (
      <HeaderContainer>
        <Link to="/">
          <GoThreeBars size="48" color="#fff" />
        </Link>
        <Text>{children}</Text>
        <LoginContainer>
          {store!.session.isLoggedIn ? (
            <React.Fragment>
              <User>{store!.session!.user!.commonName}</User>
              <StyledLink to="" onClick={this.logout}>
                Kirjaudu ulos
              </StyledLink>
            </React.Fragment>
          ) : (
            <StyledLink to="" onClick={this.login}>
              Kirjaudu
            </StyledLink>
          )}
        </LoginContainer>
      </HeaderContainer>
    )
  }
}
