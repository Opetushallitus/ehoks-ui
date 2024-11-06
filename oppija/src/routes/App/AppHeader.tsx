import { Link } from "react-router-dom"
import { getActiveDomain } from "localeUtils"
import { inject, observer } from "mobx-react"
import React, { useState } from "react"
import { MdMenu } from "react-icons/md"
import { useIntl, FormattedMessage } from "react-intl"
import { MobileMenu } from "routes/App/MobileMenu"
import { IRootStore } from "stores/RootStore"
import { Locale } from "stores/TranslationStore"
import styled from "styled"
import ehoksLogo from "./ehoks_logo.png"
import { FeedbackReminder } from "./FeedbackReminder"
import { LinkButton } from "components/Button"

interface TopLinkProps {
  active?: boolean
}

const HeaderContainer = styled("header")`
  width: 100%;
  color: #fff;
  background-color: ${(props) => props.theme.colors.header.background};
  line-height: 16px;
  font-size: 18px;
`

const TopLinksContainer = styled("div")`
  width: 100%;
  background-color: #254905;
  font-size: 16px;
  font-weight: 600;
  padding-left: 20px;

  @media screen and (max-width: ${(props) =>
      props.theme.breakpoints.Tablet}px) {
    display: none;
  }

  @media screen and (max-width: ${(props) =>
      props.theme.breakpoints.Desktop}px) {
    padding-left: 0;
  }
`

const TopLinks = styled("nav")`
  line-height: 20px;
  max-width: ${(props) => props.theme.maxWidth}px;
  margin: 0 auto;
`

const SkipToMain = styled("a")`
  left: -999px;
  position: absolute;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
  z-index: -999;

  &:focus,
  &:active {
    position: unset;
    color: #fff;
    width: auto;
    height: auto;
    padding: 5px 20px 5px 20px;
    line-height: 20px;
    z-index: 999;
  }
`

const TopLink = styled("a")<TopLinkProps>`
  display: inline-block;
  padding: 5px 20px 5px 20px;
  text-decoration: none;
  color: #fff;
  line-height: 20px;
  background: ${(props) =>
    props.active ? props.theme.colors.header.background : "transparent"};

  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.green300};
  }
`

const TitleContainer = styled("div")`
  max-width: ${(props) => props.theme.maxWidth}px;
  margin: 0 auto;
  display: flex;
  align-items: center;
`

const MobileMenuToggle = styled("div")`
  display: none;
  @media screen and (max-width: ${(props) =>
      props.theme.breakpoints.Desktop}px) {
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

const Logo = styled("img")`
  height: 64px;
  margin: 4px 0 4px 40px;

  @media screen and (max-width: ${(props) =>
      props.theme.breakpoints.Desktop}px) {
    margin: 4px 0 4px 20px;
  }
`

const LogoutContainer = styled("div")`
  display: block;
  margin: 0 40px 0 0;
  font-weight: 300;

  @media screen and (max-width: ${(props) =>
      props.theme.breakpoints.Tablet}px) {
    display: none;
  }

  @media screen and (max-width: ${(props) =>
      props.theme.breakpoints.Desktop}px) {
    margin-right: 20px;
  }
`

const User = styled("div")`
  font-weight: 400;
  margin-bottom: 5px;
`

const LogoutLink = styled(Link)`
  color: #fff;
`

const Flex = styled("div")`
  flex: 1;
`

interface LanguageSelectorProps {
  loggedIn: boolean
}
const LanguageSelector = styled("div")<LanguageSelectorProps>`
  margin: ${(props) => (props.loggedIn ? "0 40px 0 0" : "0 80px 0 0")};
  a {
    margin-right: 10px;
    font-size: 15px;
    cursor: pointer;
  }

  @media screen and (max-width: ${(props) =>
      props.theme.breakpoints.Tablet}px) {
    display: none;
  }
`

interface AppHeaderProps {
  store?: IRootStore
}

interface AppHeaderState {
  showMenu: boolean
}

export const AppHeader = inject("store")(
  observer((props: AppHeaderProps) => {
    const [state, setState] = useState<AppHeaderState>({
      showMenu: false
    })

    const logoutOppija = async (event: React.MouseEvent) => {
      event.preventDefault()
      const rootStore = props.store
      // featureflags.casOppija
      const casOppijaFeatureFlag = true
      if (casOppijaFeatureFlag) {
        try {
          // Ends ehoks session, doesn't end cas session
          await rootStore!.session.logoutOppija()
        } finally {
          // Ends cas session
          window.location.href =
            rootStore!.translations.activeLocale === Locale.FI
              ? rootStore!.environment.casOppijaLogoutUrlFi
              : rootStore!.environment.casOppijaLogoutUrlSv
        }
      } else {
        rootStore!.session.logoutOppija()
      }
    }

    const changeLocale = (locale: Locale) => (event: React.MouseEvent) => {
      event.preventDefault()
      props.store!.translations.setActiveLocale(locale)
    }

    const toggleMenu = () => {
      setState({ ...state, showMenu: !state.showMenu })
    }

    const showFeedbackModal = () => {
      props.store!.notifications.makeFeedbackModalVisible()
    }

    const { store } = props
    const intl = useIntl()
    const { session } = store!
    const { user, isLoggedIn } = session!
    const { activeLocale } = store!.translations
    const hasUnansweredFeedbackLinks =
      store!.notifications.hasUnanswaredFeedbackLinks
    const activeDomain = getActiveDomain()
    return (
      <HeaderContainer>
        <TopLinksContainer>
          <TopLinks>
            <SkipToMain href="#main">
              <FormattedMessage
                id="header.skipToMainLink"
                defaultMessage="Siirry pääsisältöön"
              />
            </SkipToMain>
            <TopLink href={`https://${activeDomain}/`}>
              <FormattedMessage
                id="header.opintopolkuLink"
                defaultMessage="Opintopolku.fi"
              />
            </TopLink>
            <TopLink href={`https://${activeDomain}/oma-opintopolku/`}>
              <FormattedMessage
                id="header.omaOpintopolkuLink"
                defaultMessage="Oma Opintopolku"
              />
            </TopLink>
            <TopLink href={`https://eperusteet.${activeDomain}/`}>
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
          <MobileMenuToggle onClick={toggleMenu}>
            <MdMenu size="40" />
            <h3>
              <FormattedMessage
                id="header.mobiilivalikkoTitle"
                defaultMessage="Valikko"
              />
            </h3>
          </MobileMenuToggle>

          <Logo
            src={ehoksLogo}
            alt={intl.formatMessage({
              id: "header.ehoksLogoLabel"
            })}
          />

          <FeedbackReminder
            hasFeedbackLinks={hasUnansweredFeedbackLinks}
            onClick={showFeedbackModal}
          />
          <Flex />

          <LanguageSelector loggedIn={isLoggedIn}>
            {activeLocale === Locale.FI ? (
              <LinkButton onClick={changeLocale(Locale.SV)}>
                <FormattedMessage
                  id="header.swedishLocaleLink"
                  defaultMessage="På svenska"
                />
              </LinkButton>
            ) : (
              <LinkButton onClick={changeLocale(Locale.FI)}>
                <FormattedMessage
                  id="header.finnishLocaleLink"
                  defaultMessage="Suomeksi"
                />
              </LinkButton>
            )}
          </LanguageSelector>

          {isLoggedIn && user && (
            <LogoutContainer>
              <User>
                {user.usingValtuudet ? (
                  <FormattedMessage
                    id="header.valtuudet"
                    defaultMessage="(Valtuudet)"
                  />
                ) : null}
                {user.firstName} {user.surname}
              </User>
              <LogoutLink to="" onClick={logoutOppija}>
                <FormattedMessage
                  id="header.kirjauduUlosLink"
                  defaultMessage="Kirjaudu ulos"
                />
              </LogoutLink>
            </LogoutContainer>
          )}
        </TitleContainer>
        {state.showMenu && (
          <MobileMenu
            activeLocale={activeLocale}
            changeLocale={changeLocale}
            toggleMenu={toggleMenu}
            logout={logoutOppija}
            session={session!}
          />
        )}
      </HeaderContainer>
    )
  })
)
