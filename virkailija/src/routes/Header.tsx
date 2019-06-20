import { Link } from "@reach/router"
import { inject, observer } from "mobx-react"
import React from "react"
import { FormattedMessage } from "react-intl"
import { IRootStore } from "stores/RootStore"
import styled from "styled"

interface TopLinkProps {
  active?: boolean
}

const HeaderContainer = styled("header")`
  display: flex;
  flex: 1;
  color: #fff;
  background-color: #1e516d;
  height: 48px;
  font-size: 14px;
  justify-content: center;
  align-items: center;
`

const ActiveIndicator = styled("span")``

const TopLink = styled(Link)<TopLinkProps>`
  position: relative;
  display: inline-block;
  padding: 5px 20px 5px 20px;
  text-decoration: none;
  color: #fff;

  span {
    display: none;
  }

  &:focus {
    outline: 2px solid ${props => props.theme.colors.waterBlue};
  }

  &:not(:last-child) {
    border-right: 2px solid #326e8a;
  }

  &[aria-current] span {
    background: #fff;
    display: block;
    position: absolute;
    bottom: 0;
    left: 50%;
    right: 50%;
    width: 3px;
    height: 3px;
  }
`

interface HeaderProps {
  store?: IRootStore
}

@inject("store")
@observer
export class Header extends React.Component<HeaderProps> {
  render() {
    const { session } = this.props.store!
    const hasWritePrivilege = session.selectedOrganisation &&
      session.selectedOrganisation.privileges.indexOf("write") > -1
    return (
      <HeaderContainer>
        <TopLink to="/ehoks-ui/koulutuksenjarjestaja">
          <FormattedMessage
            id="header.opiskelijatLink"
            defaultMessage="Opiskelijat"
          />
          <ActiveIndicator />
        </TopLink>
        {
          hasWritePrivilege ?
            <TopLink to="/ehoks-ui/luohoks">
              <FormattedMessage
                id="header.tietojenTallennusLink"
                defaultMessage="Uusi HOKS"
              />
              <ActiveIndicator />
            </TopLink> : null
        }
        <TopLink to="/ehoks-ui/raportit">
          <FormattedMessage
            id="header.raportitLink"
            defaultMessage="Raportit"
          />
          <ActiveIndicator />
        </TopLink>
        <TopLink to="/ehoks-ui/dokumentaatio">
          <FormattedMessage
            id="header.dokumentaatioLink"
            defaultMessage="Dokumentaatio"
          />
          <ActiveIndicator />
        </TopLink>
      </HeaderContainer>
    )
  }
}
