import { Link } from "@reach/router"
import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import React from "react"
import styled from "react-emotion"
import { SessionStore } from "stores/SessionStore"
import { injectSession } from "utils"

interface TopLinkProps {
  active?: boolean
}

const HeaderContainer = styled("div")`
  width: 100%;
  color: #fff;
  background-color: #149ecb;
  line-height: 16px;
  font-size: 18px;
  font-weight: 600;
`

const TopLinksContainer = styled("div")`
  width: 100%;
  background-color: #06526b;
  font-size: 16px;
`

const TopLinks = styled("div")`
  line-height: 20px;
  max-width: 1160px;
  margin: 0 auto;
`

const TopLink = styled("a")`
  display: inline-block;
  padding: 5px 20px 5px 20px;
  text-decoration: none;
  color: #fff;
  line-height: 20px;
  background: ${(props: TopLinkProps) =>
    props.active ? "#149ecb" : "transparent"};
`

const TitleContainer = styled("div")`
  max-width: 1160px;
  margin: 0 auto;
  display: flex;
  align-items: center;
`

const Title = styled("div")`
  flex: 1;
  font-size: 32px;
  line-height: 100%;
  font-weight: 400;
  margin: 25px 5px 25px 20px;
`

const LogoutContainer = styled("div")`
  margin: 0 20px 0 0;
  font-weight: 300;
`

const User = styled("div")`
  font-weight: 400;
  margin-bottom: 5px;
`

const LogoutLink = styled(Link)`
  color: #fff;
`

export interface AppHeaderProps {
  session?: Instance<typeof SessionStore>
}

@inject(injectSession)
@observer
export class AppHeader extends React.Component<AppHeaderProps> {
  logout = (event: React.MouseEvent) => {
    event.preventDefault()
    this.props.session.logout()
  }

  render() {
    const { session } = this.props
    return (
      <HeaderContainer>
        <TopLinksContainer>
          <TopLinks>
            <TopLink href="https://opintopolku.fi/">Opintopolku.fi</TopLink>
            <TopLink href="https://opintopolku.fi/oma-opintopolku/">
              Oma Opintopolku
            </TopLink>
            <TopLink href="https://eperusteet.opintopolku.fi/">
              ePerusteet
            </TopLink>
            <TopLink active={true} href="/">
              eHOKS
            </TopLink>
          </TopLinks>
        </TopLinksContainer>
        <TitleContainer>
          <Title>eHOKS</Title>
          <LogoutContainer>
            {session.isLoggedIn && (
              <React.Fragment>
                <User>{session.user.commonName}</User>
                <LogoutLink to="" onClick={this.logout}>
                  Kirjaudu ulos
                </LogoutLink>
              </React.Fragment>
            )}
          </LogoutContainer>
        </TitleContainer>
      </HeaderContainer>
    )
  }
}
