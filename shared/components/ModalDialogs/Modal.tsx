import React from "react"
import ReactDOM from "react-dom"
import styled from "styled"

const getModalRoot = () => document.getElementById("modal-root")
const modalRootError = () => {
  throw new Error(`modal-root not found`)
}

const ModalBackground = styled("div")`
  background: #000;
  opacity: 0.1;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

export class Modal extends React.Component<any> {
  el: HTMLDivElement
  constructor(props: any) {
    super(props)
    this.el = document.createElement("div")
  }

  componentDidMount() {
    const modalRoot = getModalRoot()
    if (modalRoot) {
      modalRoot.appendChild(this.el)
    } else {
      modalRootError()
    }
  }

  componentWillUnmount() {
    const modalRoot = getModalRoot()
    if (modalRoot) {
      modalRoot.removeChild(this.el)
    } else {
      modalRootError()
    }
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el)
  }
}

export const ModalWithBackground = () => (
  <Modal>
    <ModalBackground />
  </Modal>
)
