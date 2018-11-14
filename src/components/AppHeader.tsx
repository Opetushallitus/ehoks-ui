import { Link } from "@reach/router"
import { inject, observer } from "mobx-react"
import React from "react"
import { MdMenu } from "react-icons/md"
import { FormattedMessage } from "react-intl"
import { ISessionStore } from "stores/SessionStore"
import styled from "styled"
import { injectSession } from "utils"

interface TopLinkProps {
  active?: boolean
  theme?: any
}

const HeaderContainer = styled("header")`
  width: 100%;
  color: #fff;
  background-color: ${props => props.theme.colors.header.background};
  line-height: 16px;
  font-size: 18px;
  font-weight: 600;
`

const TopLinksContainer = styled("div")`
  width: 100%;
  background-color: #06526b;
  font-size: 16px;
  padding-left: 20px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    display: none;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    padding-left: 0;
  }
`

const TopLinks = styled("nav")`
  line-height: 20px;
  max-width: ${props => props.theme.maxWidth}px;
  margin: 0 auto;
`

const TopLink = styled("a")`
  display: inline-block;
  padding: 5px 20px 5px 20px;
  text-decoration: none;
  color: #fff;
  line-height: 20px;
  background: ${(props: TopLinkProps) =>
    props.active ? props.theme.colors.header.background : "transparent"};

  &:focus {
    outline: 2px solid ${props => props.theme.colors.waterBlue};
  }
`

const TitleContainer = styled("div")`
  max-width: ${props => props.theme.maxWidth}px;
  margin: 0 auto;
  display: flex;
  align-items: center;
`

const MobileMenu = styled("div")`
  display: none;
  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    display: block;
    margin: 0 20px;

    h3 {
      margin: -5px 0 0 0;
      font-size: 12px;
      font-weight: 300;
      text-transform: uppercase;
      text-align: center;
    }
  }
`

const Title = styled("div")`
  flex: 1;
  font-size: 32px;
  line-height: 100%;
  font-weight: 400;
  margin: 25px 5px 25px 40px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    margin: 25px 5px 25px 20px;
  }
`

const LogoutContainer = styled("div")`
  display: block;
  margin: 0 20px 0 0;
  font-weight: 300;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    display: none;
  }
`

const User = styled("div")`
  font-weight: 400;
  margin-bottom: 5px;
`

const LogoutLink = styled(Link)`
  color: #fff;
`

export interface AppHeaderProps {
  session?: ISessionStore
}

@inject(injectSession)
@observer
export class AppHeader extends React.Component<AppHeaderProps> {
  logout = (event: React.MouseEvent) => {
    event.preventDefault()
    this.props.session!.logout()
  }

  render() {
    const { session } = this.props
    return (
      <HeaderContainer>
        <TopLinksContainer>
          <TopLinks>
            <TopLink href="https://opintopolku.fi/">
              <FormattedMessage
                id="header.opintopolkuLink"
                defaultMessage="Opintopolku.fi"
              />
            </TopLink>
            <TopLink href="https://opintopolku.fi/oma-opintopolku/">
              <FormattedMessage
                id="header.omaOpintopolkuLink"
                defaultMessage="Oma Opintopolku"
              />
            </TopLink>
            <TopLink href="https://eperusteet.opintopolku.fi/">
              <FormattedMessage
                id="header.ePerusteetLink"
                defaultMessage="ePerusteet"
              />
            </TopLink>
            <TopLink active={true} href="/">
              <FormattedMessage id="header.ehoksLink" defaultMessage="eHOKS" />
            </TopLink>
          </TopLinks>
        </TopLinksContainer>
        <TitleContainer>
          <MobileMenu>
            <MdMenu size="40" />
            <h3>
              <FormattedMessage
                id="header.mobileMenuTitle"
                defaultMessage="Valikko"
              />
            </h3>
          </MobileMenu>
          <Title>eHOKS</Title>
          {session!.isLoggedIn && (
            <LogoutContainer>
              <User>{session!.user!.commonName}</User>
              <LogoutLink to="" onClick={this.logout}>
                <FormattedMessage
                  id="header.logoutButton"
                  defaultMessage="Kirjaudu ulos"
                />
              </LogoutLink>
            </LogoutContainer>
          )}
        </TitleContainer>
      </HeaderContainer>
    )
  }
}
