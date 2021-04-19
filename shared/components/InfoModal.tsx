import React from "react"
import { MdInfo } from "react-icons/md"
import { FormattedMessage, intlShape } from "react-intl"
import Popup from "reactjs-popup"
import styled from "styled"

const InfoToggle = styled(MdInfo)`
  vertical-align: bottom;
  width: 18px;
`

const InfoButton = styled("button")`
  margin-left: 10px;
  appearance: none;
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin: 0;
  padding: 0;
  width: auto;
  height: 28px;
  font: inherit;
  color: inherit;

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }
`

const Modal = styled("div")`
  font-size: 12px;
`
const ModalHeader = styled("div")`
  border-bottom: 1px solid gray;
  font-size: 18px;
  text-align: center;
  padding: 5px;
`
const ModalContent = styled("div")`
  font-size: 18px;
  padding: 5px;
`

interface InfoModalProps {
  partTimeAmount?: number
  className?: string
}

export class InfoModal extends React.Component<InfoModalProps> {
  static contextTypes = {
    intl: intlShape
  }
  render() {
    const { intl } = this.context
    const { className, partTimeAmount } = this.props
    return (
      <Popup
        trigger={
          <InfoButton
            aria-label={intl.formatMessage({
              id: "infoModal.naytaLisatiedot"
            })}
            className={className}
          >
            <InfoToggle size="28" color="#027fa9" />
          </InfoButton>
        }
        modal
      >
        <div role="dialog">
          <Modal>
            <ModalHeader>
              <FormattedMessage
                id="infoModal.lisatietoja"
                defaultMessage="Lisätietoja"
              />
            </ModalHeader>
            <ModalContent>
              <FormattedMessage
                id="infoModal.osaaikaisuus"
                defaultMessage="Osa-aikaisuus"
              />
              : {partTimeAmount} %
              <br />
            </ModalContent>
          </Modal>
        </div>
      </Popup>
    )
  }
}
