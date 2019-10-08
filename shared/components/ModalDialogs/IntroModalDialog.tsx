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
    introDialogOpen: boolean,
    initialAcknowledged: boolean
}

interface IntroModalProps {
    store?: IRootStore
}

@inject("store")
@observer
export class IntroModalDialog extends React.Component<IntroModalProps, IntroModalState> {
    state: IntroModalState = {
        introDialogOpen: false,
        initialAcknowledged: true
    }

    componentDidMount() {
        const {store} = this.props
        reaction(
            () => store!.session.settings.introDialog.userAcknowledgedIntroDialog,
            (acknowledged, reaction) => {
                this.setState({initialAcknowledged: acknowledged, introDialogOpen: !acknowledged })
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
        const {settings: {introDialog}} = this.props.store!.session
        if (this.state.initialAcknowledged)
            return null

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