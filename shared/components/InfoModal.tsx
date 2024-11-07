import React from "react"
import { MdInfo } from "react-icons/md"
import { useIntl, FormattedMessage } from "react-intl"
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
  osaamisenHankkimistapaKoodisto?: IKoodistoVastaus
  perusta?: IKoodistoVastaus
  className?: string
  nayttoymparistoDetails?: string
  startDate?: string
  endDate?: string
  keskeytymisajanjaksot?: IKeskeytymisajanjakso[]
  hoksId?: number
  opiskeluoikeusOid?: string
  oppijaOid?: string
  hankkimistapaTyyppi?: string
  oppisopimuksenPerusta?: string
  tyopaikanNimi?: string
  ytunnus?: string
  ohjaajaNimi?: string
  ohjaajaEmail?: string
  ohjaajaPuhelinnumero?: string
}

export const InfoModal = (props: InfoModalProps) => {
  const intl = useIntl()
  const {
    className,
    partTimeAmount,
    osaamisenHankkimistapaKoodisto,
    perusta,
    startDate,
    endDate,
    nayttoymparistoDetails,
    keskeytymisajanjaksot,
    hoksId,
    opiskeluoikeusOid,
    oppijaOid,
    hankkimistapaTyyppi,
    oppisopimuksenPerusta,
    ytunnus,
    ohjaajaNimi,
    ohjaajaEmail,
    ohjaajaPuhelinnumero
  } = props
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
                {" "}
                <FormattedDate date={startDate} dateNotSet="" />
                {" - "}
                <FormattedDate date={endDate} dateNotSet="" />
              </span>
            )}
          </ModalHeader>
          <ModalContent>
            {hoksId && (
              <>
                <StyledStrong>
                  <FormattedMessage
                    id="raportit.ehoksid"
                    defaultMessage="eHOKS ID"
                  />
                  :
                </StyledStrong>{" "}
                {hoksId}
                <br />
              </>
            )}
            {opiskeluoikeusOid && (
              <>
                <StyledStrong>
                  <FormattedMessage
                    id="raportit.opiskeluoikeusoid"
                    defaultMessage="Opiskeluoikeus Oid"
                  />
                  :
                </StyledStrong>{" "}
                {opiskeluoikeusOid}
                <br />
              </>
            )}
            {oppijaOid && (
              <>
                <StyledStrong>
                  <FormattedMessage
                    id="raportit.oppijanumeroTitle"
                    defaultMessage="Oppija Oid"
                  />
                  :
                </StyledStrong>{" "}
                {oppijaOid}
                <br />
              </>
            )}
            {((osaamisenHankkimistapaKoodisto &&
              osaamisenHankkimistapaKoodisto.nimi) ||
              hankkimistapaTyyppi) && (
              <>
                <StyledStrong>
                  <FormattedMessage
                    id="infoModal.hankkimistapaTyyppi"
                    defaultMessage="Osaamisen hankkimistapa"
                  />
                  :
                </StyledStrong>{" "}
                {osaamisenHankkimistapaKoodisto &&
                osaamisenHankkimistapaKoodisto.nimi
                  ? osaamisenHankkimistapaKoodisto.nimi
                  : ""}
                {hankkimistapaTyyppi ? hankkimistapaTyyppi : ""}
                <br />
              </>
            )}
            {((perusta && perusta.nimi) || oppisopimuksenPerusta) && (
              <>
                <StyledStrong>
                  <FormattedMessage
                    id="infoModal.perusta"
                    defaultMessage="Oppisopimuksen perusta"
                  />
                  :
                </StyledStrong>{" "}
                {perusta && perusta.nimi ? perusta.nimi : ""}
                {oppisopimuksenPerusta ? oppisopimuksenPerusta : ""}
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
            {ytunnus && (
              <>
                <StyledStrong>
                  <FormattedMessage
                    id="raportit.ytunnus"
                    defaultMessage="Y-Tunnus"
                  />
                  :
                </StyledStrong>{" "}
                {ytunnus}
                <br />
              </>
            )}
            {ohjaajaNimi && (
              <>
                <StyledStrong>
                  <FormattedMessage
                    id="raportit.ohjaajannimi"
                    defaultMessage="Ohjaajan nimi"
                  />
                  :
                </StyledStrong>{" "}
                {ohjaajaNimi}
                <br />
              </>
            )}
            {ohjaajaEmail && (
              <>
                <StyledStrong>
                  <FormattedMessage
                    id="raportit.email"
                    defaultMessage="Ohjaajan Email"
                  />
                  :
                </StyledStrong>{" "}
                {ohjaajaEmail}
                <br />
              </>
            )}
            {ohjaajaPuhelinnumero && (
              <>
                <StyledStrong>
                  <FormattedMessage
                    id="raportit.puhelin"
                    defaultMessage="Ohjaajan puhelinnumero"
                  />
                  :
                </StyledStrong>{" "}
                {ohjaajaPuhelinnumero}
                <br />
              </>
            )}
            {keskeytymisajanjaksot &&
              (keskeytymisajanjaksot.length || null) && (
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
