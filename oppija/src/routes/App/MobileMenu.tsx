import React from "react"
import { MdClose } from "react-icons/md"
import { FormattedMessage } from "react-intl"
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

interface MobileMenuProps {
  activeLocale: "fi" | "sv"
  changeLocale: (locale: string) => (event: React.MouseEvent) => void
  toggleMenu: () => void
}

export const MobileMenu: React.FunctionComponent<MobileMenuProps> = ({
  activeLocale,
  changeLocale,
  toggleMenu
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
          onClick={changeLocale("fi")}
          role="button"
          selected={activeLocale === "fi"}
        >
          <FormattedMessage
            id="mobileMenu.finnishLocaleLink"
            defaultMessage="Suomeksi"
          />
        </Language>{" "}
        <Language
          onClick={changeLocale("sv")}
          role="button"
          selected={activeLocale === "sv"}
        >
          <FormattedMessage
            id="mobileMenu.swedishLocaleLink"
            defaultMessage="På svenska"
          />
        </Language>
      </Languages>
    </Container>
  )
}
