import React from "react"
import Modal from "react-modal"
import styled from "../../styled";
import {Button} from "../Button";
import {IRootStore} from "../../../oppija/src/stores/RootStore";
import {inject, observer} from "mobx-react";
import {Checkbox} from "../Checkbox";
import {reaction} from "mobx";

Modal.setAppElement("#app")

export const CloseIntroPageButton = styled(Button)`
  background: transparent;
  color: #000;
`

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

interface IntroModalState {
    introDialogOpen: boolean,
    initialAcknowledgedStatus: boolean
}

interface IntroModalProps {
    store?: IRootStore
}

@inject("store")
@observer
export class IntroModalDialog extends React.Component<IntroModalProps, IntroModalState> {
    state: IntroModalState = {
        introDialogOpen: false,
        initialAcknowledgedStatus: true
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

    render() {
        if (this.state.initialAcknowledgedStatus)
            return null

        const {introDialog} = this.props.store!.session.settings

        return (
            <Modal
                isOpen={this.state.introDialogOpen}
                style={customStyles}
            >
                <h3>Tervetuloa käyttämään eHOKSIA!</h3>
                <p>eHOKS on palvelu, jossa näet oman henkilökohtaisen opintosuunnitelmasi ja tavoitteesi milloin vain.</p>
                <p>Voit käyttää palvelua tietokoneella tai mobiililaitteella.</p>
                {/*<CloseIntroPageButton onClick={this.closeIntroDialog}>*/}
                {/*    Sulje*/}
                {/*</CloseIntroPageButton>*/}
                <NextIntroPageButton>
                    Seuraava
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