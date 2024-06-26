import React from "react"
import { HOKSButton } from "components/HOKSButton"
import { FormattedDate } from "components/FormattedDate"
import { FormattedMessage } from "react-intl"
import styled from "styled"
import { Instance } from "mobx-state-tree"
import { HOKS } from "models/HOKS"
import { observer } from "mobx-react"
import { Link } from "react-router-dom"
import { MdEdit } from "react-icons/md"

const SuunnitelmaContainer = styled("div")`
  display: flex;
  align-items: center;
  border: 1px solid #979797;
  background: #fff;
  padding: 15px 15px 15px 30px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  justify-content: center;

  &:first-of-type {
    margin-top: 20px;
  }
`

const EditIconContainer = styled("div")`
  margin: 0 20px;
`

const Text = styled("div")`
  flex: 1;
  font-size: 20px;
  font-weight: 600;
`

const OpenHOKSButton = styled(HOKSButton)`
  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    margin-top: 20px;
  }
`

interface SuunnitelmaProps {
  suunnitelma: Instance<typeof HOKS>
  hoksPath: string
  oppijaId?: string
  showEditIcon?: boolean
}

export const Suunnitelma = observer(function Suunnitelma(
  props: SuunnitelmaProps
) {
  const { hoksPath, suunnitelma, oppijaId, showEditIcon = false } = props
  return (
    <SuunnitelmaContainer>
      <Text>
        {suunnitelma.tutkinnonNimi}, {suunnitelma.oppilaitos}.{" "}
        {suunnitelma.paattymispaiva ? (
          <span>
            <FormattedMessage
              id="suunnitelma.opintoOikeusPaattynytTitle"
              defaultMessage="Opinto-oikeus päättynyt"
            />{" "}
            <FormattedDate date={suunnitelma.paattymispaiva} />
          </span>
        ) : suunnitelma.aloitusPvm ? (
          <span>
            <FormattedMessage
              id="suunnitelma.aloitettuTitle"
              defaultMessage="Aloitettu"
            />{" "}
            <FormattedDate date={suunnitelma.aloitusPvm} />
          </span>
        ) : null}
        .
      </Text>

      {showEditIcon && (
        <EditIconContainer>
          <Link to={`/ehoks-virkailija-ui/hoks/${oppijaId}/${suunnitelma.id}`}>
            <MdEdit size={24} color="#000" />
          </Link>
        </EditIconContainer>
      )}

      <OpenHOKSButton to={`${hoksPath}${suunnitelma.eid}`}>
        <FormattedMessage
          id="suunnitelma.avaaHoksTitle"
          defaultMessage="Avaa HOKS"
        />
      </OpenHOKSButton>
    </SuunnitelmaContainer>
  )
})
