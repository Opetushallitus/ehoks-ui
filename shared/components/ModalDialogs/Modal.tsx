import React from "react"
import ReactDOM from "react-dom"
import styled from "styled"

const ModalBackground = styled("div")`
  background: #000;
  opacity: 0.1;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

export class Modal extends React.Component<{}> {
  el: HTMLDivElement
  constructor(props: any) {
    super(props)
    this.el = document.createElement("div")
  }

  componentDidMount() {
    document.getElementById("modal-root")!.appendChild(this.el)
  }

  componentWillUnmount() {
    document.getElementById("modal-root")!.removeChild(this.el)
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
