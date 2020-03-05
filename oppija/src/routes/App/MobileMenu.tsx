import { Link } from "@reach/router"
import React from "react"
import { MdClose } from "react-icons/md"
import { FormattedMessage } from "react-intl"
import { ISessionStore } from "stores/SessionStore"
import { Locale } from "stores/TranslationStore"
import styled from "styled"
import useOnClickOutside from "use-onclickoutside"

const Container = styled("div")`
  position: fixed;
  top: 0;
  left: 0;
  font-weight: 300;
  font-size: 14px;
  background: #282828;
  display: flex;
  flex-direction: column;
`

const TitleBar = styled("div")`
  flex: 1;
  border-bottom: 1px solid #151517;
  padding: 15px 15px 15px 25px;
  display: flex;
  font-size: 16px;
`

const Title = styled("div")`
  flex: 1;
`

const Languages = styled("div")`
  border-top: 1px solid #3f3f3f;
  text-transform: uppercase;
  padding: 15px 20px 15px 25px;
`

const LogoutLink = styled(Link)`
  color: #ddd;
`

interface LanguageProps {
  selected: boolean
}
const Language = styled("a")<LanguageProps>`
  cursor: pointer;
  color: ${props => (props.selected ? "#fff" : "#a5acb0")};
  padding-right: 20px;
`

const CloseButton = styled("button")`
  display: flex;
  cursor: pointer;
  appearance: none;
  padding: 0;
  border: none;
  background: transparent;
  color: #a5acb0;
`

const LinksContainer = styled("div")`
  background: #313334;
  font-size: 16px;
  padding: 20px;
`

const UserInfo = styled("div")`
  margin-bottom: 15px;
`

interface MobileMenuProps {
  activeLocale: Locale.FI | Locale.SV
  changeLocale: (locale: Locale) => (event: React.MouseEvent) => void
  toggleMenu: () => void
  logout: (event: React.MouseEvent) => void
  session: ISessionStore
}

export const MobileMenu: React.FunctionComponent<MobileMenuProps> = ({
  activeLocale,
  changeLocale,
  toggleMenu,
  logout,
  session
}) => {
  const ref = React.useRef(null)
  useOnClickOutside(ref, toggleMenu)

  return (
    <Container ref={ref}>
      <TitleBar>
        <Title>
          <FormattedMessage id="mobileMenu.title" defaultMessage="Valikko" />
        </Title>
        <CloseButton onClick={toggleMenu}>
          <MdClose size={20} />
        </CloseButton>
      </TitleBar>
      <Languages>
        <Language
          onClick={changeLocale(Locale.FI)}
          role="button"
          selected={activeLocale === Locale.FI}
        >
          <FormattedMessage
            id="mobileMenu.finnishLocaleLink"
            defaultMessage="Suomeksi"
          />
        </Language>{" "}
        <Language
          onClick={changeLocale(Locale.SV)}
          role="button"
          selected={activeLocale === Locale.SV}
        >
          <FormattedMessage
            id="mobileMenu.swedishLocaleLink"
            defaultMessage="På svenska"
          />
        </Language>
      </Languages>
      {session.isLoggedIn && (
        <LinksContainer>
          <UserInfo>
            {session.user!.firstName} {session.user!.surname}
          </UserInfo>
          <LogoutLink to="" onClick={logout}>
            <FormattedMessage
              id="mobileMenu.kirjauduUlosLink"
              defaultMessage="Kirjaudu ulos"
            />
          </LogoutLink>
        </LinksContainer>
      )}
    </Container>
  )
}
