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
  border-top: 4px solid #3a7a10;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 5px 0px;
`
const ModalHeader = styled("div")`
  border-bottom: 1px solid gray;
  font-size: 16px;
  text-align: left;
  padding: 5px;
`
const ModalContent = styled("div")`
  font-size: 16px;
  font-weight: 600;
  padding: 5px;
  background-color: #f4fff4;
  color: #636769;
`

const StyledStrong = styled("strong")`
  color: black;
`

interface InfoModalProps {
  partTimeAmount?: number
  hankkimistapaTyyppi?: IKoodistoVastaus
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
      hankkimistapaTyyppi,
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
            <InfoToggle size="28" color="#3A7A10" />
          </InfoButton>
        }
        modal
      >
        <div role="dialog">
          <Modal>
            <ModalHeader>
              <StyledStrong>
                <FormattedMessage
                  id="infoModal.lisatietoja"
                  defaultMessage="Lisätietoja työpaikkajaksosta"
                />
              </StyledStrong>
              <br />
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
              {hankkimistapaTyyppi && hankkimistapaTyyppi.nimi && (
                <>
                  <StyledStrong>
                    <FormattedMessage
                      id="infoModal.hankkimistapaTyyppi"
                      defaultMessage="Osaamisen hankkimistapa"
                    />
                    :
                  </StyledStrong>{" "}
                  {hankkimistapaTyyppi.nimi}
                  <br />
                </>
              )}
              {perusta && perusta.nimi && (
                <>
                  <StyledStrong>
                    <FormattedMessage
                      id="infoModal.perusta"
                      defaultMessage="Oppisopimuksen perusta"
                    />
                    :
                  </StyledStrong>{" "}
                  {perusta.nimi}
                  <br />
                </>
              )}
              {partTimeAmount && (
                <>
                  <StyledStrong>
                    <FormattedMessage
                      id="infoModal.osaaikaisuus"
                      defaultMessage="Osa-aikaisuus"
                    />
                    :
                  </StyledStrong>{" "}
                  {partTimeAmount} %
                  <br />
                </>
              )}
              {keskeytymisajanjaksot && (keskeytymisajanjaksot.length || null) && (
                <>
                  <StyledStrong>
                    <FormattedMessage
                      id="infoModal.keskeytymisajanjaksot"
                      defaultMessage="Keskeytymisajanjaksot"
                    />
                    :
                  </StyledStrong>
                  <div>
                    {" "}
                    {keskeytymisajanjaksot.map(k => (
                      <div key={k.alku}>
                        <FormattedDate date={k.alku} dateNotSet="" />
                        {" - "}
                        <FormattedDate date={k.loppu} dateNotSet="" />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </Popup>
    )
  }
}
