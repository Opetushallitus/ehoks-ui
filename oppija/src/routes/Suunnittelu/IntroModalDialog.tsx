import { Button } from "components/Button"
import { Checkbox } from "components/Checkbox"
import Flag from "components/icons/Flag"
import { reaction } from "mobx"
import { inject, observer } from "mobx-react"
import React from "react"
import { MdEventNote, MdExtension } from "react-icons/md"
import { FormattedMessage, intlShape } from "react-intl"
import Modal from "react-modal"
import { IRootStore } from "stores/RootStore"
import styled from "styled"
import ehoksLogo from "./ehoks_logo.png"

Modal.setAppElement("#app")

enum IntroPage {
  Page1,
  Page2,
  Page3
}

const IntroPageContainer = styled("div")`
  margin: 0 0 20px 0;
  min-height: 340px;
  width: 600px;
`

const IntroPageTitle = styled("h1")`
  font-weight: 400;
  font-size: 30px;
`

const IntroPageTextContainer = styled("p")`
  font-size: 17px;
  width: 50%;
  margin: 0 auto 20px auto;
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
  font-family: "Source Sans Pro", sans-serif;
  box-sizing: inherit;
  position: absolute;

  left: 50%;
  right: auto;
  bottom: auto;
  overflow: auto;
  border-radius: 4px;
  outline: none;
  padding: 20px;
  margin-right: -50%;
  transform: translate(-50%, 0);
  color: rgb(255, 255, 255);
  text-align: center;
`

const IntroModalContainer = styled("div")`
  background: ${props => props.theme.colors.header.background};
  max-width: 850px;
  padding: 15px 20px;
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
  border: 4px solid #027fa9;
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

const VerticallyCenteredText = styled("div")`
  display: flex;
  justify-content: center;
`

class IntroPage1 extends React.Component {
  static contextTypes = {
    intl: intlShape
  }
  render() {
    const { intl } = this.context
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
        <Logo
          src={ehoksLogo}
          alt={intl.formatMessage({
            id: "introDialog.page1Logo"
          })}
        />
      </>
    )
  }
}

class IntroPage2 extends React.Component {
  render() {
    return (
      <>
        <IntroPageTitle>
          <FormattedMessage
            id="introDialog.page2Title"
            defaultMessage="Tietosi ovat eHOKSissa kolmessa osassa:"
          />
        </IntroPageTitle>
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
      </>
    )
  }
}

class IntroPage3 extends React.Component {
  render() {
    return (
      <>
        <IntroPageTitle>
          <FormattedMessage
            id="introDialog.page3Title"
            defaultMessage="eHOKS-tiedoistasi vastaa oma oppilaitoksesi"
          />
        </IntroPageTitle>
        <VerticallyCenteredText>
          <FormattedMessage
            id="introDialog.page3paragraph1"
            defaultMessage="Ole yhteydessä omaan opettajaasi, jos tietosi eivät ole ajan tasalla
                palvelussa."
          />
        </VerticallyCenteredText>
      </>
    )
  }
}

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

@inject("store")
@observer
export class IntroModalDialog extends React.Component<
  IntroModalProps,
  IntroModalState
> {
  state: IntroModalState = {
    introDialogOpen: false,
    initialAcknowledgedStatus: true,
    currentPage: IntroPage.Page1
  }

  componentDidMount() {
    const { store } = this.props
    reaction(
      () => store!.session.settings.introDialog.userAcknowledgedIntroDialog,
      (acknowledged, initialReaction) => {
        this.setState({
          initialAcknowledgedStatus: acknowledged,
          introDialogOpen: !acknowledged
        })
        initialReaction.dispose()
      },
      { fireImmediately: true }
    )
  }

  closeIntroDialog = async () => {
    const { saveSettings } = this.props.store!.session
    await saveSettings()
    this.setState({ introDialogOpen: false })
  }

  nextPage = () => {
    switch (this.state.currentPage) {
      case IntroPage.Page1:
        this.setState({ currentPage: IntroPage.Page2 })
        break
      case IntroPage.Page2:
        this.setState({ currentPage: IntroPage.Page3 })
        break
      case IntroPage.Page3:
        this.closeIntroDialog()
    }
  }

  toFirstPage = () => {
    this.setState({ currentPage: IntroPage.Page1 })
  }

  toSecondPage = () => {
    this.setState({ currentPage: IntroPage.Page2 })
  }

  toThirdPage = () => {
    this.setState({ currentPage: IntroPage.Page3 })
  }

  render() {
    // render nothing if user has already acknowledged the intro dialog
    if (this.state.initialAcknowledgedStatus) {
      return null
    }

    const { introDialog } = this.props.store!.session.settings

    return (
      <StyledModal isOpen={this.state.introDialogOpen}>
        <IntroModalContainer>
          <IntroPageContainer>
            <IntroPageContent page={this.state.currentPage} />
          </IntroPageContainer>
          <NextIntroPageButton onClick={this.nextPage}>
            {this.state.currentPage === IntroPage.Page3 ? (
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
              active={this.state.currentPage === IntroPage.Page1}
              onClick={this.toFirstPage}
            />
            <NavigationCircle
              active={this.state.currentPage === IntroPage.Page2}
              onClick={this.toSecondPage}
            />
            <NavigationCircle
              active={this.state.currentPage === IntroPage.Page3}
              onClick={this.toThirdPage}
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
  }
}
