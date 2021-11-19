import { Link } from "@reach/router"
import { Accordion } from "components/Accordion"
import { Button } from "components/Button"
import { ModalDialog } from "components/ModalDialogs/ModalDialog"
import { inject, observer } from "mobx-react"
import { IHOKS } from "models/HOKS"
import { ISessionUser } from "models/SessionUser"
import React from "react"
import { FormattedMessage } from "react-intl"
import styled from "../../styled"

const DeleteMessageContainer = styled("div")`
  border-color: gray;
  border-radius: 5px;
  padding: 5px;
  display: inline-flex;
`

const ButtonContainer = styled("div")`
  display: flex;
  align-items: left;
  justify-content: left;
  margin: 10px 0 10px 0;
`

const DeleteHoksButton = styled(Button)`
  background: salmon;
  color: white;
  padding: 10px 30px;
  font-size: 16px;

  &:focus {
    outline: none;
    box-shadow: none;
  }
`
const HoksInfoRow = styled("div")`
  clear: both;
`

const HoksInfoTitleCell = styled("div")`
  width: 45%;
  display: inline-block;
  padding: 10px 0px;
  vertical-align: top;
  font-weight: 400;
  color: #6e6e7e;
  text-align: left;
`

const HoksInfoValueCell = styled("div")`
  width: 45%;
  display: inline-block;
  padding: 10px 0px;
  vertical-align: top;
`

const DeleteLink = styled(Link)`
  margin-right: 2em;
`
const CancelButton = styled(Button)`
  background: transparent;
  color: #000;
`

interface HoksPoistoState {
  hoksPoistoModalOpen: boolean
}

interface HoksPoistoProps {
  hoks: IHOKS
  student: ISessionUser
  title: React.ReactNode
  hoksPoistoOpen: boolean
  toggleHoksPoisto: (accordion: string) => () => void
}

@inject("store")
@observer
export class HoksPoisto extends React.Component<
  HoksPoistoProps,
  HoksPoistoState
> {
  state: HoksPoistoState = {
    hoksPoistoModalOpen: false
  }

  closeHoksPoistoModal = () => {
    this.setState({
      hoksPoistoModalOpen: false
    })
  }

  openHoksPoistoModal = () => {
    this.setState({
      hoksPoistoModalOpen: true
    })
  }

  shallowDeleteHoks = async (hoks: IHOKS) => {
    hoks.shallowDelete()
    this.setState({
      hoksPoistoModalOpen: false
    })
  }

  render() {
    const {
      hoks,
      student,
      title,
      hoksPoistoOpen,
      toggleHoksPoisto
    } = this.props

    return (
      <Accordion
        id="hoksPoisto"
        open={hoksPoistoOpen}
        title={title}
        onToggle={toggleHoksPoisto("hoksPoisto")}
      >
        <DeleteMessageContainer>
          <FormattedMessage
            id="tavoitteet.PoistaHoksInfo"
            defaultMessage="placeholder"
          />
        </DeleteMessageContainer>
        <br />
        <ButtonContainer>
          <DeleteHoksButton onClick={this.openHoksPoistoModal}>
            Poista HOKS
          </DeleteHoksButton>
        </ButtonContainer>

        <ModalDialog
          open={this.state.hoksPoistoModalOpen}
          closeModal={this.closeHoksPoistoModal}
          label="Haluatko varmasti poistaa hoksin?"
        >
          <b>
            <FormattedMessage
              id="tavoitteet.PoistaHoksConfirm"
              defaultMessage="Haluatko varmasti poistaa hoksin?"
            />
          </b>
          <br />
          <br />
          <HoksInfoRow>
            <HoksInfoTitleCell>
              <FormattedMessage
                id="tavoitteet.idTitle"
                defaultMessage="eHoks ID"
              />
            </HoksInfoTitleCell>
            <HoksInfoValueCell>{hoks.id}</HoksInfoValueCell>
          </HoksInfoRow>
          <HoksInfoRow>
            <HoksInfoTitleCell>
              <FormattedMessage
                id="koulutuksenJarjestaja.opiskelijaTitle"
                defaultMessage="Opiskelijan nimi"
              />
            </HoksInfoTitleCell>
            <HoksInfoValueCell>{student.fullName}</HoksInfoValueCell>
          </HoksInfoRow>
          <HoksInfoRow>
            <HoksInfoTitleCell>
              <FormattedMessage
                id="opiskelusuunnitelma.tutkinnonNimiTitle"
                defaultMessage="Tutkinnon nimi"
              />
            </HoksInfoTitleCell>
            <HoksInfoValueCell>{hoks.tutkinnonNimi}</HoksInfoValueCell>
          </HoksInfoRow>
          <HoksInfoRow>
            <HoksInfoTitleCell>
              <FormattedMessage
                id="tavoitteet.opiskeluoikeudOidTitle"
                defaultMessage="Opiskeluoikeus-oid"
              />
            </HoksInfoTitleCell>
            <HoksInfoValueCell>{hoks.opiskeluoikeusOid}</HoksInfoValueCell>
          </HoksInfoRow>
          <HoksInfoRow>
            <HoksInfoTitleCell>
              <FormattedMessage
                id="tavoitteet.OppilaitoksenNimi"
                defaultMessage="Oppilaitoksen nimi"
              />
            </HoksInfoTitleCell>
            <HoksInfoValueCell>{hoks.oppilaitos}</HoksInfoValueCell>
          </HoksInfoRow>
          <ButtonContainer>
            <DeleteLink
              to={`/ehoks-virkailija-ui/koulutuksenjarjestaja`}
              onClick={() => this.shallowDeleteHoks(hoks)}
            >
              <DeleteHoksButton>Poista</DeleteHoksButton>
            </DeleteLink>
            <CancelButton onClick={this.closeHoksPoistoModal}>
              Peruuta
            </CancelButton>
          </ButtonContainer>
        </ModalDialog>
      </Accordion>
    )
  }
}
