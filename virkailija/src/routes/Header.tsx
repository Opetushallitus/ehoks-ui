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

const OppilaitosSelect = styled("select")`
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 0;
  margin: 10px 0;
  background: #fff;
  color: #2b2b2b;
  border-radius: 2px;
  border: 1px solid #999;
`

interface HeaderProps {
  store?: IRootStore
}

@inject("store")
@observer
export class Header extends React.Component<HeaderProps> {
  onOrganisationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { session } = this.props.store!
    const oppilaitosOid = e.target.value
    session.changeSelectedOrganisationOid(oppilaitosOid)
  }

  render() {
    const { session } = this.props.store!
    const selectedOrganisation =
      session.user! &&
      session.user!.organisationPrivileges.find(
        o => o.oid === session.selectedOrganisationOid
      )
    const hasWritePrivilege =
      selectedOrganisation &&
      selectedOrganisation.privileges.indexOf("write") > -1
    const hasSuperUserPrivilege =
      selectedOrganisation &&
      selectedOrganisation.roles.indexOf("oph-super-user") > -1
    return (
      <HeaderContainer>
        {/* Change to proper component instead of Select */}
        {session!.user && session!.user.organisationPrivileges ? (
          <OppilaitosSelect
            value={session.selectedOrganisationOid}
            onChange={this.onOrganisationChange}
          >
            {session!.user.organisationPrivileges.map(p => (
              <option
                key={p.oid}
                value={p.oid}
                aria-selected={p.oid === session.selectedOrganisationOid}
              >
                {p.oid}
              </option>
            ))}
          </OppilaitosSelect>
        ) : null}
        <TopLink to="/ehoks-virkailija-ui/koulutuksenjarjestaja">
          <FormattedMessage
            id="header.opiskelijatLink"
            defaultMessage="Opiskelijat"
          />
          <ActiveIndicator />
        </TopLink>
        {hasWritePrivilege ? (
          <TopLink to="/ehoks-virkailija-ui/luohoks">
            <FormattedMessage
              id="header.tietojenTallennusLink"
              defaultMessage="Uusi HOKS"
            />
            <ActiveIndicator />
          </TopLink>
        ) : null}
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
        {hasSuperUserPrivilege ? (
          <TopLink to="/ehoks-virkailija-ui/yllapito">
            <FormattedMessage
              id="header.yllapitoLink"
              defaultMessage="Ylläpito"
            />
            <ActiveIndicator />
          </TopLink>
        ) : null}
      </HeaderContainer>
    )
  }
}
