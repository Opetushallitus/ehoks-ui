import { Link } from "@reach/router"
import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import React from "react"
import styled from "react-emotion"
import { GoThreeBars } from "react-icons/go"
import { SessionStore } from "stores/SessionStore"
import { injectSession } from "utils"

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
  session?: Instance<typeof SessionStore>
}

@inject(injectSession)
@observer
export class Header extends React.Component<HeaderProps> {
  logout = (event: React.MouseEvent) => {
    event.preventDefault()
    this.props.session.logout()
  }

  login = (event: React.MouseEvent) => {
    event.preventDefault()
    window.location.href = this.props.session.loginUrl
  }

  render() {
    const { children, session } = this.props
    return (
      <HeaderContainer>
        <Link to="/">
          <GoThreeBars size="48" color="#fff" />
        </Link>
        <Text>{children}</Text>
        <LoginContainer>
          {session.isLoggedIn ? (
            <React.Fragment>
              <User>{session.user.commonName}</User>
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
