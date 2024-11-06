import { useNavigate, useLocation } from "react-router"
import { Link } from "react-router-dom"
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
  background-color: ${(props) => props.theme.colors.green700};
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
    outline: 2px solid ${(props) => props.theme.colors.green300};
  }

  &:not(:last-child) {
    border-right: 2px solid ${(props) => props.theme.colors.green900};
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

const LanguageChangeLink = styled("a")<TopLinkProps>`
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: 5px 20px 5px 20px;
  text-decoration: none;
  color: #fff;

  span {
    display: none;
  }

  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.green300};
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

const LanguageChanger: ({
  activeLocale
}: {
  activeLocale: Locale
}) => JSX.Element = observer(({ activeLocale }) => {
  const location = useLocation()
  return (
    <LanguageChangeLink
      onClick={() => {
        // navigate ei toimi tässä jostain syystä
        window.location.assign(
          `${location.pathname}?lang=${
            activeLocale === Locale.FI ? Locale.SV : Locale.FI
          }`
        )
      }}
    >
      {activeLocale === Locale.FI ? (
        <FormattedMessage
          id="header.swedishLocaleLink"
          defaultMessage="På svenska"
        />
      ) : (
        <FormattedMessage
          id="header.finnishLocaleLink"
          defaultMessage="Suomeksi"
        />
      )}
    </LanguageChangeLink>
  )
})

export const Header = inject("store")(
  observer(({ store }: HeaderProps) => {
    const navigate = useNavigate()
    const handleOnOrganisationChange = (oid: string) => {
      const { session, koulutuksenJarjestaja } = store!
      session.changeSelectedOrganisationOid(oid)
      koulutuksenJarjestaja.search.resetActivePage()
      koulutuksenJarjestaja.search.fetchOppijat()
      localStorage.setItem("selectedOrganisationOid", oid)
      navigate(`/ehoks-virkailija-ui/koulutuksenjarjestaja/${oid}`)
    }
    const { session } = store!
    const { activeLocale } = store!.translations
    return (
      <HeaderContainer>
        {session.organisations && (
          <OrganisationDropdown
            organisations={session.organisations}
            onChange={handleOnOrganisationChange}
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
        <LanguageChanger activeLocale={activeLocale} />
      </HeaderContainer>
    )
  })
)
