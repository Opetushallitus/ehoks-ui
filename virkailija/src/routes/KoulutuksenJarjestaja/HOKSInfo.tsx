import { IHOKS } from "models/HOKS"
import React from "react"
import { FormattedMessage } from "react-intl"
import styled from "styled"
import { FormattedDate } from "components/FormattedDate"
import { IOppija } from "stores/KoulutuksenJarjestajaStore"

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

export interface HOKSInfoProps {
  suunnitelma: IHOKS
  oppija: Pick<IOppija, "nimi" | "paivitetty">
}

const OsaamisenHankkimisenTarveMessage = ({
  osaamisenHankkimisenTarve
}: Pick<IHOKS, "osaamisenHankkimisenTarve">) => {
  if (osaamisenHankkimisenTarve == null)
    return (
      <FormattedMessage
        id="koulutuksenJarjestaja.opiskelija.osaamisenHankkimisenTarveNullTitle"
        defaultMessage="Opiskelijan osaamisen hankkimisen tarve ei tiedossa"
      />
    )

  return osaamisenHankkimisenTarve ? (
    <FormattedMessage
      id="koulutuksenJarjestaja.opiskelija.osaamisenHankkimisenTarveTrueTitle"
      defaultMessage="Opiskelijalla on osaamisen hankkimisen tarve"
    />
  ) : (
    <FormattedMessage
      id="koulutuksenJarjestaja.opiskelija.osaamisenHankkimisenTarveFalseTitle"
      defaultMessage="Opiskelijalla ei ole osaamisen hankkimisen tarvetta"
    />
  )
}

export class HOKSInfo extends React.Component<HOKSInfoProps> {
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
          &nbsp; <FormattedDate date={suunnitelma.ensikertainenHyvaksyminen} />
        </Timestamp>
        <Timestamp>
          <FormattedMessage
            id="koulutuksenJarjestaja.opiskelija.paivitettyTitle"
            defaultMessage="Päivitetty"
          />
          &nbsp; <FormattedDate date={oppija.paivitetty} />
        </Timestamp>
        <Timestamp>
          <OsaamisenHankkimisenTarveMessage
            osaamisenHankkimisenTarve={suunnitelma.osaamisenHankkimisenTarve}
          />
        </Timestamp>
      </StudentDetails>
    )
  }
}