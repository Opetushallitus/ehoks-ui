import { Link } from "react-router-dom"
import { Accordion } from "components/Accordion"
import { Button } from "components/Button"
import { ModalDialog } from "components/ModalDialogs/ModalDialog"
import { inject, observer } from "mobx-react"
import { IHOKS } from "models/HOKS"
import { ISessionUser } from "models/SessionUser"
import React, { useState } from "react"
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
  align-items: start;
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

export const HoksPoisto = inject("store")(
  observer((props: HoksPoistoProps) => {
    const [state, setState] = useState<HoksPoistoState>({
      hoksPoistoModalOpen: false
    })

    const closeHoksPoistoModal = () => {
      setState({
        hoksPoistoModalOpen: false
      })
    }

    const openHoksPoistoModal = () => {
      setState({
        hoksPoistoModalOpen: true
      })
    }

    const shallowDeleteHoks = async (hoks: IHOKS) => {
      hoks.shallowDelete()
      setState({
        hoksPoistoModalOpen: false
      })
    }

    const { hoks, student, title, hoksPoistoOpen, toggleHoksPoisto } = props

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
          <DeleteHoksButton onClick={openHoksPoistoModal}>
            <FormattedMessage
              id="tavoitteet.PoistaHoks"
              defaultMessage="placeholder"
            />
          </DeleteHoksButton>
        </ButtonContainer>

        <ModalDialog
          open={state.hoksPoistoModalOpen}
          closeModal={closeHoksPoistoModal}
          label="Haluatko varmasti poistaa hoksin?"
        >
          <b>
            <FormattedMessage
              id="tavoitteet.DeleteModalPoistaHoksConfirmTitle"
              defaultMessage="Haluatko varmasti poistaa HOKSin?"
            />
          </b>
          <br />
          <br />
          <HoksInfoRow>
            <HoksInfoTitleCell>
              <FormattedMessage
                id="tavoitteet.DeleteModalIdTitle"
                defaultMessage="eHoks ID"
              />
            </HoksInfoTitleCell>
            <HoksInfoValueCell>{hoks.id}</HoksInfoValueCell>
          </HoksInfoRow>
          <HoksInfoRow>
            <HoksInfoTitleCell>
              <FormattedMessage
                id="tavoitteet.DeleteModalOpiskelijaTitle"
                defaultMessage="Opiskelijan nimi"
              />
            </HoksInfoTitleCell>
            <HoksInfoValueCell>{student.fullName}</HoksInfoValueCell>
          </HoksInfoRow>
          <HoksInfoRow>
            <HoksInfoTitleCell>
              <FormattedMessage
                id="tavoitteet.DeleteModalTutkinnonNimiTitle"
                defaultMessage="Tutkinnon nimi"
              />
            </HoksInfoTitleCell>
            <HoksInfoValueCell>{hoks.tutkinnonNimi}</HoksInfoValueCell>
          </HoksInfoRow>
          <HoksInfoRow>
            <HoksInfoTitleCell>
              <FormattedMessage
                id="tavoitteet.DeleteModalOpiskeluoikeusOidTitle"
                defaultMessage="Opiskeluoikeus-oid"
              />
            </HoksInfoTitleCell>
            <HoksInfoValueCell>{hoks.opiskeluoikeusOid}</HoksInfoValueCell>
          </HoksInfoRow>
          <HoksInfoRow>
            <HoksInfoTitleCell>
              <FormattedMessage
                id="tavoitteet.DeleteModalOppilaitoksenNimi"
                defaultMessage="Oppilaitoksen nimi"
              />
            </HoksInfoTitleCell>
            <HoksInfoValueCell>{hoks.oppilaitos}</HoksInfoValueCell>
          </HoksInfoRow>
          <ButtonContainer>
            <DeleteLink
              to={`/ehoks-virkailija-ui/koulutuksenjarjestaja`}
              onClick={() => shallowDeleteHoks(hoks)}
            >
              <DeleteHoksButton>
                <FormattedMessage
                  id="tavoitteet.DeleteModalPoistaButton"
                  defaultMessage="Poista"
                />
              </DeleteHoksButton>
            </DeleteLink>
            <CancelButton onClick={closeHoksPoistoModal}>
              <FormattedMessage
                id="tavoitteet.DeleteModalPeruutaButton"
                defaultMessage="Peruuta"
              />
            </CancelButton>
          </ButtonContainer>
        </ModalDialog>
      </Accordion>
    )
  })
)
