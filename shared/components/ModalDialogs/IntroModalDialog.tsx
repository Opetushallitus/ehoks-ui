import React from "react"
import Modal from "react-modal"
import styled from "../../styled";
import {Button} from "../Button";
import {IRootStore} from "../../../oppija/src/stores/RootStore";
import {inject, observer} from "mobx-react";
import {Checkbox} from "../Checkbox";
import {reaction} from "mobx";

Modal.setAppElement("#app")

export const NextIntroPageButton = styled(Button)`
  background: #0076d9;
  color: #fff;
  padding: 10px 70px;
`

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        color: "#fff",
        backgroundColor: "#149ecb",
        textAlign: "center"
    }
}

enum IntroPage {Page1, Page2, Page3}

class IntroPage1 extends React.Component {
    render() {
        return (
            <>
                <h3>Tervetuloa käyttämään eHOKSIA!</h3>
                <p>eHOKS on palvelu, jossa näet oman henkilökohtaisen opintosuunnitelmasi ja tavoitteesi milloin
                    vain.</p>
                <p>Voit käyttää palvelua tietokoneella tai mobiililaitteella.</p>
            </>)
    }
}

class IntroPage2 extends React.Component {
    render() {
        return (
            <>
                <h3>Tietosi ovat eHOKSissa kolmessa osassa:</h3>
                <p>Oma tavoitteesi</p>
                <p>Aiempi osaamisesi</p>
                <p>Opintosuunnitelmasi</p>
            </>)
    }
}

class IntroPage3 extends React.Component {
    render() {
        return (
            <>
                <h3>eHOKS-tiedoistasi vastaa oma oppilaitoksesi</h3>
                <p>Ole yhteydessä omaan opettajaasi, jos tietosi eivät ole ajan tasalla palvelussa.</p>
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

interface IntroModalState {
    introDialogOpen: boolean,
    initialAcknowledgedStatus: boolean,
    currentIntroPage: IntroPage,
    nextPageButtonText: string
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
        nextPageButtonText: "Seuraava"
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
                this.setState({currentIntroPage: IntroPage.Page3, nextPageButtonText: "Valmis"})
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
            <Modal
                isOpen={this.state.introDialogOpen}
                style={customStyles}
            >
                <IntroPageContent page={this.state.currentIntroPage} />
                <NextIntroPageButton onClick={this.nextPage}>
                    {this.state.nextPageButtonText}
                </NextIntroPageButton>
                <Checkbox
                    id={"IntroModal"}
                    checked={introDialog.userAcknowledgedIntroDialog}
                    onToggle={introDialog.toggleUserAcknowledgementOfIntro}
                >
                    Älä näytä enää seuraavalla kerralla
                </Checkbox>
            </Modal>
        )
    }
}