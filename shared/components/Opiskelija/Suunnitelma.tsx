import React from "react"
import { HOKSButton } from "components/HOKSButton"
import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
import { FormattedMessage } from "react-intl"
import styled from "styled"
import { Instance } from "mobx-state-tree"
import { HOKS } from "models/HOKS"
import { observer } from "mobx-react"

const SuunnitelmaContainer = styled("div")`
  display: flex;
  align-items: center;
  border: 1px solid #979797;
  background: #fff;
  padding: 15px 15px 15px 30px;
  margin-bottom: 20px;

  &:first-of-type {
    margin-top: 20px;
  }
`

const Text = styled("div")`
  flex: 1;
  font-size: 20px;
  font-weight: 600;
`

interface SuunnitelmaProps {
  suunnitelma: Instance<typeof HOKS>
  hoksPath: string
}

export const Suunnitelma = observer(function Suunnitelma(
  props: SuunnitelmaProps
) {
  const { hoksPath, suunnitelma } = props
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
            {format(parseISO(suunnitelma.paattymispaiva), "d.M.yyyy")}
          </span>
        ) : (
          <span>
            <FormattedMessage
              id="suunnitelma.aloitettuTitle"
              defaultMessage="Aloitettu"
            />{" "}
            {format(parseISO(suunnitelma.aloitusPvm), "d.M.yyyy")}
          </span>
        )}
        .
      </Text>

      <HOKSButton to={`${hoksPath}${suunnitelma.eid}`}>
        <FormattedMessage
          id="suunnitelma.avaaHoksTitle"
          defaultMessage="Avaa HOKS"
        />
      </HOKSButton>
    </SuunnitelmaContainer>
  )
})
