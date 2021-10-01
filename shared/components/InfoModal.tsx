import React from "react"
import { MdInfo } from "react-icons/md"
import { FormattedMessage, intlShape } from "react-intl"
import { FormattedDate } from "components/FormattedDate"
import { IKoodistoVastaus } from "../models/KoodistoVastaus"
import { IKeskeytymisajanjakso } from "../models/Keskeytymisajanjakso"
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
  font-weight: 400;
`
const ModalHeader = styled("div")`
  border-bottom: 1px solid gray;
  font-size: 16px;
  text-align: left;
  padding: 5px;
`
const ModalContent = styled("div")`
  font-size: 16px;
  padding: 5px;
`

interface InfoModalProps {
  partTimeAmount?: number
  perusta?: IKoodistoVastaus
  className?: string
  nayttoymparistoDetails?: string
  startDate?: string
  endDate?: string
  keskeytymisajanjaksot?: IKeskeytymisajanjakso[]
}

export class InfoModal extends React.Component<InfoModalProps> {
  static contextTypes = {
    intl: intlShape
  }
  render() {
    const { intl } = this.context
    const {
      className,
      partTimeAmount,
      perusta,
      startDate,
      endDate,
      nayttoymparistoDetails,
      keskeytymisajanjaksot
    } = this.props
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
                defaultMessage="Lisätietoja työpaikkajaksosta"
              />
              <span> {nayttoymparistoDetails}</span>
              {startDate === endDate ? (
                <span>
                  {" "}
                  <FormattedDate date={startDate} dateNotSet="" />
                </span>
              ) : (
                <span>
                  <FormattedDate date={startDate} dateNotSet="" />
                  {" - "}
                  <FormattedDate date={endDate} dateNotSet="" />
                </span>
              )}
            </ModalHeader>
            <ModalContent>
              {partTimeAmount && (
                <>
                  <FormattedMessage
                    id="infoModal.osaaikaisuus"
                    defaultMessage="Osa-aikaisuus"
                  />
                  : {partTimeAmount} %
                  <br />
                </>
              )}
              {perusta && perusta.nimi && (
                <>
                  <FormattedMessage
                    id="infoModal.perusta"
                    defaultMessage="Oppisopimuksen perusta"
                  />
                  : {perusta.nimi}
                  <br />
                </>
              )}
              {keskeytymisajanjaksot && (
                <>
                  <FormattedMessage
                    id="infoModal.keskeytymisajanjaksot"
                    defaultMessage="Keskeytymisajanjaksot"
                  />
                  <div>
                    {keskeytymisajanjaksot.map(k => (
                      <div>
                        <FormattedDate date={k.alku} dateNotSet="" />
                        {" - "}
                        <FormattedDate date={k.loppu} dateNotSet="" />
                      </div>
                    ))}
                  </div>
                  <br />
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </Popup>
    )
  }
}
