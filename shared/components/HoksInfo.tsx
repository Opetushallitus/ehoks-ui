import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
import { IHOKS } from "models/HOKS"
import React from "react"
import { FormattedMessage } from "react-intl"
import styled from "styled"

const StudentName = styled("h2")`
margin-top: 0;
`

const StudentDetails = styled("div")`
flex: 1;

h2 {
  font-weight: 400;
  font-size: 28px;
}
`

const Timestamp = styled("div")`
font-size: 20px;
margin-bottom: 10px;
`

interface Oppija {
  nimi: string,
  hyvaksytty: string | null | undefined,
  paivitetty: string | null | undefined
}

export interface HOKSInfoProps {
  suunnitelma: IHOKS
  oppija: Oppija
}

export class HoksInfo extends React.Component<HOKSInfoProps> {
  render() {
    const { suunnitelma, oppija } = this.props
    return (
      <StudentDetails>
        <StudentName>{oppija && oppija.nimi}</StudentName>

        <Timestamp>
          <FormattedMessage
            id="koulutuksenJarjestaja.opiskelija.hoksPaivamaaratTitle"
            defaultMessage="HOKS päivämäärät"
          />
          :
                  </Timestamp>
        <Timestamp>
          <FormattedMessage
            id="koulutuksenJarjestaja.opiskelija.hyvaksyttyTitle"
            defaultMessage="Ens. hyväksytty"
          />
          &nbsp;{" "}
          {oppija.hyvaksytty
            ? format(parseISO(oppija.hyvaksytty), "d.M.yyyy")
            : "-"}
        </Timestamp>
        <Timestamp>
          <FormattedMessage
            id="koulutuksenJarjestaja.opiskelija.paivitettyTitle"
            defaultMessage="Päivitetty"
          />
          &nbsp;{" "}
          {oppija.paivitetty
            ? format(parseISO(oppija.paivitetty), "d.M.yyyy")
            : "-"}
        </Timestamp>
        <Timestamp>
          {suunnitelma.osaamisenHankkimisenTarve ? (
            <FormattedMessage
              id="koulutuksenJarjestaja.opiskelija.osaamisenHankkimisenTarveTrueTitle"
              defaultMessage="Opiskelijalla on osaamisen hankkimisen tarve"
            />
          ) : (
              <FormattedMessage
                id="koulutuksenJarjestaja.opiskelija.osaamisenHankkimisenTarveFalseTitle"
                defaultMessage="Opiskelijalla ei ole osaamisen hankkimisen tarvetta"
              />
            )}
        </Timestamp>
      </StudentDetails>
    )
  }
}