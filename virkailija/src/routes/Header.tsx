import { Link, navigate } from "@reach/router"
import { OrganisationDropdown } from "components/OrganisationDropdown"
import { inject, observer } from "mobx-react"
import React from "react"
import { FormattedMessage } from "react-intl"
import { IRootStore } from "stores/RootStore"
import { Locale } from "stores/TranslationStore"
import styled from "styled"

interface TopLinkProps {
  active?: boolean
}

const HeaderContainer = styled("header")`
  display: flex;
  flex: 1;
  color: #fff;
  background-color: ${props => props.theme.colors.green700};
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
    outline: 2px solid ${props => props.theme.colors.green300};
  }

  &:not(:last-child) {
    border-right: 2px solid ${props => props.theme.colors.green900};
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
  handleOnOrganisationChange = (oid: string) => {
    const { session, koulutuksenJarjestaja } = this.props.store!
    session.changeSelectedOrganisationOid(oid)
    koulutuksenJarjestaja.search.resetActivePage()
    koulutuksenJarjestaja.search.fetchOppijat()
    localStorage.setItem("selectedOrganisationOid", oid)
    navigate(`/ehoks-virkailija-ui/koulutuksenjarjestaja/${oid}`)
  }

  render() {
    const { session } = this.props.store!
    return (
      <HeaderContainer>
        {session.organisations && (
          <OrganisationDropdown
            organisations={session.organisations}
            onChange={this.handleOnOrganisationChange}
            value={session.selectedOrganisationOid}
            lang={Locale.FI}
          />
        )}
        <TopLink to="/ehoks-virkailija-ui/koulutuksenjarjestaja">
          <FormattedMessage
            id="header.opiskelijatLink"
            defaultMessage="Opiskelijat"
          />
          <ActiveIndicator />
        </TopLink>
        {session.hasWritePrivilege && (
          <TopLink to="/ehoks-virkailija-ui/luohoks">
            <FormattedMessage
              id="header.tietojenTallennusLink"
              defaultMessage="Uusi HOKS"
            />
            <ActiveIndicator />
          </TopLink>
        )}
        <TopLink to="/ehoks-virkailija-ui/raportit">
          <FormattedMessage
            id="header.raportitLink"
            defaultMessage="Raportit"
          />
          <ActiveIndicator />
        </TopLink>
        <TopLink to="/ehoks-virkailija-ui/dokumentaatio">
          <FormattedMessage
            id="header.dokumentaatioLink"
            defaultMessage="Dokumentaatio"
          />
          <ActiveIndicator />
        </TopLink>
        {session.hasSuperUserPrivilege && (
          <TopLink to="/ehoks-virkailija-ui/yllapito">
            <FormattedMessage
              id="header.yllapitoLink"
              defaultMessage="Ylläpito"
            />
            <ActiveIndicator />
          </TopLink>
        )}
      </HeaderContainer>
    )
  }
}
