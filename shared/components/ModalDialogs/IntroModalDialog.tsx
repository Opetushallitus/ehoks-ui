import React from "react"
import Modal from "react-modal"
import styled from "../../styled";
import {Button} from "../Button";
import {IRootStore} from "../../../oppija/src/stores/RootStore";
import {inject, observer} from "mobx-react";
import {Checkbox} from "../Checkbox";

Modal.setAppElement("#app")

export const CloseIntroPageButton = styled(Button)`
  background: transparent;
  color: #000;
`

export const NextIntroPageButton = styled(Button)`
  background: transparent;
  color: #000;
`

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)"
    }
}

interface IntroModalState {
    introDialogOpen: boolean
}

interface IntroModalProps {
    store?: IRootStore
}

@inject("store")
@observer
export class IntroModalDialog extends React.Component<IntroModalProps, IntroModalState> {
    state: IntroModalState = {
        introDialogOpen: true
    }

    componentDidMount() {
        const {introDialog} = this.props.store!.session.settings
        introDialog.showIntroDialog ? this.openIntroDialog() : this.closeIntroDialog()
    }

    openIntroDialog = () => {
        this.setState({introDialogOpen: true})
    }

    closeIntroDialog = () => {
        this.setState({introDialogOpen: false})
    }

    render() {
        const {introDialog} = this.props.store!.session.settings

        return (
            <Modal
                isOpen={this.state.introDialogOpen}
                style={customStyles}
            >
                <p>Tervetuloa käyttämään eHOKSIA!</p>
                <CloseIntroPageButton onClick={this.closeIntroDialog}>
                    Sulje
                </CloseIntroPageButton>
                <NextIntroPageButton>
                    Seuraava
                </NextIntroPageButton>
                <Checkbox
                    id={"IntroModal"}
                    checked={introDialog.userAcknowledgedIntroDialog}
                    onToggle={introDialog.toggleUserAcknowledgementOfIntro}
                >
                    Älä näytä enää
                </Checkbox>
            </Modal>
        )
    }
}