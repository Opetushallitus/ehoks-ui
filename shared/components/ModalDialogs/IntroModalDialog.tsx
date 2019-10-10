import React from "react"
import Modal from "react-modal"
import styled from "../../styled";
import {Button} from "../Button";
import {IRootStore} from "../../../oppija/src/stores/RootStore";
import {inject, observer} from "mobx-react";
import {Checkbox} from "../Checkbox";
import {reaction} from "mobx";

Modal.setAppElement("#app")

enum IntroPage {Page1, Page2, Page3}

const IntroPageTitle = styled("h1")`
    margin: 30px 150px 30px;
    font-weight: 400;
    font-size: 30px;
`

const IntroPageTextContainer = styled("p")`
    margin: 0 200px 20px;
    font-size: 17px;
`

class IntroPage1 extends React.Component {
    render() {
        return (
            <>
                <IntroPageTitle>Tervetuloa käyttämään eHOKSIA!</IntroPageTitle>
                <IntroPageTextContainer>eHOKS on palvelu, jossa näet oman henkilökohtaisen opintosuunnitelmasi ja tavoitteesi milloin
                    vain.</IntroPageTextContainer>
                <IntroPageTextContainer>Voit käyttää palvelua tietokoneella tai mobiililaitteella.</IntroPageTextContainer>
            </>)
    }
}

class IntroPage2 extends React.Component {
    render() {
        return (
            <>
                <IntroPageTitle>Tietosi ovat eHOKSissa kolmessa osassa:</IntroPageTitle>
                <IntroPageTextContainer>Oma tavoitteesi</IntroPageTextContainer>
                <IntroPageTextContainer>Aiempi osaamisesi</IntroPageTextContainer>
                <IntroPageTextContainer>Opintosuunnitelmasi</IntroPageTextContainer>
            </>)
    }
}

class IntroPage3 extends React.Component {
    render() {
        return (
            <>
                <IntroPageTitle>eHOKS-tiedoistasi vastaa oma oppilaitoksesi</IntroPageTitle>
                <IntroPageTextContainer>Ole yhteydessä omaan opettajaasi, jos tietosi eivät ole ajan tasalla palvelussa.</IntroPageTextContainer>
            </>)
    }
}

interface IntroPageContentProps {
    page: IntroPage
}

class IntroPageContent extends React.Component<IntroPageContentProps> {
    render() {
        switch(this.props.page) {
            case IntroPage.Page1: {
                return <IntroPage1/>
            }
            case IntroPage.Page2: {
                return <IntroPage2/>
            }
            case IntroPage.Page3: {
                return <IntroPage3/>
            }
        }
    }
}

const NextIntroPageButton = styled(Button)`
  background: ${props => props.theme.colors.buttons.background};
  color: ${props => props.theme.colors.buttons.color};
  padding: 10px 70px;
  font-size: 16px;
`

const StyledModal = styled(Modal)`
        font-family: 'Source Sans Pro',sans-serif;
        box-sizing: inherit;
        position: absolute;
        top: 50%;
        left: 50%;
        right: auto;
        bottom: auto;
        overflow: auto;
        border-radius: 4px;
        outline: none;
        padding: 20px;
        margin-right: -50%;
        transform: translate(-50%, -50%);
        color: rgb(255, 255, 255);
        text-align: center;
`

const IntroModalContainer = styled("div")`
  background: ${props => props.theme.colors.header.background};
  max-width: 850px;
  padding: 15px 20px;
`

interface IntroModalState {
    introDialogOpen: boolean,
    initialAcknowledgedStatus: boolean,
    currentIntroPage: IntroPage,
}

interface IntroModalProps {
    store?: IRootStore
}

@inject("store")
@observer
export class IntroModalDialog extends React.Component<IntroModalProps, IntroModalState> {
    state: IntroModalState = {
        introDialogOpen: false,
        initialAcknowledgedStatus: true,
        currentIntroPage: IntroPage.Page1,
    }

    componentDidMount() {
        const {store} = this.props
        reaction(
            () => store!.session.settings.introDialog.userAcknowledgedIntroDialog,
            (acknowledged, reaction) => {
                this.setState({initialAcknowledgedStatus: acknowledged, introDialogOpen: !acknowledged })
                reaction.dispose()
            },
            { fireImmediately: true }
        )
    }

    closeIntroDialog = async () => {
        const {saveSettings} = this.props.store!.session
        await saveSettings()
        this.setState({introDialogOpen: false})
    }

    nextPage = () => {
        switch (this.state.currentIntroPage) {
            case IntroPage.Page1:
                this.setState({currentIntroPage: IntroPage.Page2})
                break
            case IntroPage.Page2:
                this.setState({currentIntroPage: IntroPage.Page3})
                break
            case IntroPage.Page3:
                this.closeIntroDialog()
        }
    }

    render() {
        if (this.state.initialAcknowledgedStatus)
            return null

        const {introDialog} = this.props.store!.session.settings

        return (

            <StyledModal
                isOpen={this.state.introDialogOpen}
            >
                <IntroModalContainer>
                    <IntroPageContent page={this.state.currentIntroPage}/>
                    <NextIntroPageButton onClick={this.nextPage}>
                        {this.state.currentIntroPage === IntroPage.Page3 ? "Valmis" : "Seuraava"}
                    </NextIntroPageButton>
                    <Checkbox
                        id={"IntroModal"}
                        checked={introDialog.userAcknowledgedIntroDialog}
                        onToggle={introDialog.toggleUserAcknowledgementOfIntro}
                    >
                        Älä näytä enää seuraavalla kerralla
                    </Checkbox>
                </IntroModalContainer>
            </StyledModal>
        )
    }
}