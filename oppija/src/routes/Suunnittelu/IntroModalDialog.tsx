import { Button } from "components/Button"
import { Checkbox } from "components/Checkbox"
import Flag from "components/icons/Flag"
import { inject, observer } from "mobx-react"
import React, { useState, useEffect } from "react"
import { MdEventNote, MdExtension } from "react-icons/md"
import { useIntl, FormattedMessage } from "react-intl"
import Modal from "react-modal"
import { IRootStore } from "stores/RootStore"
import styled from "styled"
import ehoksLogo from "./ehoks_logo.png"

enum IntroPage {
  Page1,
  Page2,
  Page3
}

const IntroPageContainer = styled("div")`
  margin: 0 0 20px 0;

  @media screen and (min-width: ${props => props.theme.breakpoints.Tablet}px) {
    display: flex;
    flex-direction: column;
    min-height: 360px;
    width: 600px;
  }
`

const IntroPageTitle = styled("h1")``

const IntroPageTextContainer = styled("p")`
  font-size: 17px;
  margin: 0 auto 20px auto;

  @media screen and (min-width: ${props => props.theme.breakpoints.Tablet}px) {
    width: 50%;
  }
`

const Logo = styled("img")`
  height: 128px;
`

const NextIntroPageButton = styled(Button)`
  background: ${props => props.theme.colors.buttons.background};
  color: ${props => props.theme.colors.buttons.color};
  padding: 10px 70px;
  margin-bottom: 20px;
  font-size: 16px;
`

const StyledModal = styled(Modal)`
  ${props => props.theme.typography.body}
  box-sizing: inherit;
  color: rgb(255, 255, 255);
  text-align: center;
  border-radius: 4px;
  outline: none;
  height: 100%;

  @media screen and (min-width: ${props => props.theme.breakpoints.Tablet}px) {
    position: absolute;
    left: 50%;
    right: auto;
    bottom: auto;
    overflow: auto;
    margin-right: -50%;
    transform: translate(-50%, 0);
    padding: 20px;
    height: unset;
  }
`

const IntroModalContainer = styled("div")`
  background: ${props => props.theme.colors.header.background};
  max-width: 850px;
  padding: 15px 20px;
  height: 100%;
`

const NavigationContainer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 20px 0;
`

interface NavigationCircleProps {
  active: boolean
}
const NavigationCircle = styled("button")<NavigationCircleProps>`
  cursor: pointer;
  background: ${props =>
    props.active
      ? props.theme.colors.modalDialog.dotActive
      : props.theme.colors.modalDialog.dot};
  height: 20px;
  width: 20px;
  border-radius: 50%;
  margin-right: 10px;
  margin-left: 10px;
  border: 0;
`

const IconContainer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 90px;
  width: 48px;
  height: 48px;
  border: 4px solid #3a7a10;
  background: #fff;
  color: #000;
  margin-right: 20px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    width: 58px;
    height: 58px;
  }
`

const ListItemWithIcon = styled("div")`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`

const ListContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const VerticallyCentered = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
`

const IntroPage1 = () => {
  const intl = useIntl()
  return (
    <>
      <IntroPageTitle>
        <FormattedMessage
          id="introDialog.page1Title"
          defaultMessage="Tervetuloa käyttämään eHOKSia!"
        />
      </IntroPageTitle>
      <IntroPageTextContainer>
        <FormattedMessage
          id="introDialog.page1Paragraph1"
          defaultMessage="eHOKS on palvelu, jossa näet oman henkilökohtaisen opintosuunnitelmasi
            ja tavoitteesi milloin vain."
        />
      </IntroPageTextContainer>
      <IntroPageTextContainer>
        <FormattedMessage
          id="introDialog.page1Paragraph2"
          defaultMessage="Voit käyttää palvelua tietokoneella tai mobiililaitteella."
        />
      </IntroPageTextContainer>
      <div>
        <Logo
          src={ehoksLogo}
          alt={intl.formatMessage({
            id: "introDialog.page1Logo"
          })}
        />
      </div>
    </>
  )
}

const IntroPage2 = () => (
  <>
    <IntroPageTitle>
      <FormattedMessage
        id="introDialog.page2Title"
        defaultMessage="Tietosi ovat eHOKSissa kolmessa osassa:"
      />
    </IntroPageTitle>
    <VerticallyCentered>
      <ListContainer>
        <div>
          <ListItemWithIcon>
            <IconContainer>
              <Flag size={24} />
            </IconContainer>
            <FormattedMessage
              id="introDialog.page2item1"
              defaultMessage="Oma tavoitteesi"
            />
          </ListItemWithIcon>
          <ListItemWithIcon>
            <IconContainer>
              <MdExtension size={24} />
            </IconContainer>
            <FormattedMessage
              id="introDialog.page2item2"
              defaultMessage="Aiempi osaamisesi"
            />
          </ListItemWithIcon>
          <ListItemWithIcon>
            <IconContainer>
              <MdEventNote size={24} />
            </IconContainer>
            <FormattedMessage
              id="introDialog.page2item3"
              defaultMessage="Opintosuunnitelmasi"
            />
          </ListItemWithIcon>
        </div>
      </ListContainer>
    </VerticallyCentered>
  </>
)

const IntroPage3 = () => (
  <>
    <IntroPageTitle>
      <FormattedMessage
        id="introDialog.page3Title"
        defaultMessage="eHOKS-tiedoistasi vastaa oma oppilaitoksesi"
      />
    </IntroPageTitle>
    <VerticallyCentered>
      <IntroPageTextContainer>
        <FormattedMessage
          id="introDialog.page3paragraph1"
          defaultMessage="Ole yhteydessä omaan opettajaasi, jos tietosi eivät ole ajan tasalla
                palvelussa."
        />
      </IntroPageTextContainer>
    </VerticallyCentered>
  </>
)

interface IntroPageContentProps {
  page: IntroPage
}

class IntroPageContent extends React.Component<IntroPageContentProps> {
  render() {
    switch (this.props.page) {
      case IntroPage.Page1: {
        return <IntroPage1 />
      }
      case IntroPage.Page2: {
        return <IntroPage2 />
      }
      case IntroPage.Page3: {
        return <IntroPage3 />
      }
    }
  }
}

interface IntroModalState {
  introDialogOpen: boolean
  initialAcknowledgedStatus: boolean
  currentPage: IntroPage
}

interface IntroModalProps {
  store?: IRootStore
}

export const IntroModalDialog = inject("store")(
  observer((props: IntroModalProps) => {
    const [state, setState] = useState<IntroModalState>({
      introDialogOpen: false,
      initialAcknowledgedStatus: true,
      currentPage: IntroPage.Page1
    })
    const { session } = props.store!

    useEffect(() => {
      Modal.setAppElement("#app")
      setState(s => ({
        ...s,
        initialAcknowledgedStatus:
          session.settings.introDialog.userAcknowledgedIntroDialog,
        introDialogOpen: !session.settings.introDialog
          .userAcknowledgedIntroDialog
      }))
    }, [session, session.settings.introDialog.userAcknowledgedIntroDialog])

    const closeIntroDialog = async () => {
      const { saveSettings } = session
      await saveSettings()
      setState({ ...state, introDialogOpen: false })
    }

    const nextPage = () => {
      switch (state.currentPage) {
        case IntroPage.Page1:
          setState({ ...state, currentPage: IntroPage.Page2 })
          break
        case IntroPage.Page2:
          setState({ ...state, currentPage: IntroPage.Page3 })
          break
        case IntroPage.Page3:
          closeIntroDialog()
      }
    }

    const toFirstPage = () => {
      setState({ ...state, currentPage: IntroPage.Page1 })
    }

    const toSecondPage = () => {
      setState({ ...state, currentPage: IntroPage.Page2 })
    }

    const toThirdPage = () => {
      setState({ ...state, currentPage: IntroPage.Page3 })
    }

    // render nothing if user has already acknowledged the intro dialog
    if (state.initialAcknowledgedStatus) {
      return null
    }

    const { introDialog } = session.settings

    return (
      <StyledModal isOpen={state.introDialogOpen}>
        <IntroModalContainer>
          <IntroPageContainer>
            <IntroPageContent page={state.currentPage} />
          </IntroPageContainer>
          <NextIntroPageButton onClick={nextPage}>
            {state.currentPage === IntroPage.Page3 ? (
              <FormattedMessage
                id="introDialog.valmisButtonLabel"
                defaultMessage="Valmis"
              />
            ) : (
              <FormattedMessage
                id="introDialog.seuraavaButtonLabel"
                defaultMessage="Seuraava"
              />
            )}
          </NextIntroPageButton>
          <NavigationContainer>
            <NavigationCircle
              active={state.currentPage === IntroPage.Page1}
              onClick={toFirstPage}
            />
            <NavigationCircle
              active={state.currentPage === IntroPage.Page2}
              onClick={toSecondPage}
            />
            <NavigationCircle
              active={state.currentPage === IntroPage.Page3}
              onClick={toThirdPage}
            />
          </NavigationContainer>
          <Checkbox
            id={"IntroModal"}
            checked={introDialog.userAcknowledgedIntroDialog}
            onToggle={introDialog.toggleUserAcknowledgementOfIntro}
          >
            <FormattedMessage
              id="introDialog.alaNaytaSeuraavallaKerralla"
              defaultMessage="Älä näytä enää seuraavalla kerralla"
            />
          </Checkbox>
        </IntroModalContainer>
      </StyledModal>
    )
  })
)
