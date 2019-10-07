import React from "react"
import Modal from "react-modal"
import styled from "../../styled";
import {Button} from "../Button";

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

interface IntroModalDialogProps {
    open: boolean
}

export function IntroModalDialog(props: IntroModalDialogProps) {
    const { open } = props
    return (
        <Modal
            isOpen={open}
            style={customStyles}
        >
            <p>Tervetuloa käyttämään eHOKSIA!</p>
            <CloseIntroPageButton>
                Sulje
            </CloseIntroPageButton>
            <NextIntroPageButton>
                Seuraava
            </NextIntroPageButton>
        </Modal>
    )
}
