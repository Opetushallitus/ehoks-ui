import React from "react"
import Modal from "react-modal"

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

Modal.setAppElement("#app")

interface ModalDialogProps {
  children?: React.ReactNode
  open: boolean
  label: string
  closeModal: () => void
}

export function ModalDialog(props: ModalDialogProps) {
  const { children, label, open, closeModal } = props
  return (
    <Modal
      isOpen={open}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel={label}
    >
      {children}
    </Modal>
  )
}
