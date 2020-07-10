import { Accordion } from "components/Accordion"
import { InfoTable } from "components/InfoTable"
import { LabeledColumn } from "components/LabeledColumn"
import { observer } from "mobx-react"
import React from "react"
import { FormattedMessage } from "react-intl"
import { FormattedDate } from "components/FormattedDate"
import { RouteComponentProps } from "@reach/router"
import { IOpiskelijapalauteTila } from "models/OpiskelijapalauteTila"
import { Button } from "components/Button"

export interface OpiskelijapalauteProps {
  open?: boolean
  toggleAccordion: (accordion: string) => () => void
  hoksID: number
  oppijaOid: string
  title: React.ReactNode
  palauteTilat: IOpiskelijapalauteTila[]
}

interface IResend {
  alkupvm: string
  tyyppi: string
}

@observer
export class Opiskelijapalaute extends React.Component<
  OpiskelijapalauteProps & RouteComponentProps
> {
  resendPalaute = (data: IResend) => async () => {
    const { hoksID, oppijaOid } = this.props

    const request = await window.fetch(
      `/ehoks-virkailija-backend/api/v1/virkailija/oppijat/${oppijaOid}/hoksit/${hoksID}/resend-palaute`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json; charset=utf-8",
          // "Caller-Id": ""
          "Content-Type": "application/json"
          // ticket: """
        },
        body: JSON.stringify(data)
      }
    )

    const json = await request.json()

    console.log(json)
  }

  render() {
    const { palauteTilat } = this.props

    return (
      <Accordion
        id="henkilotiedot"
        open={this.props.open}
        title={this.props.title}
        onToggle={this.props.toggleAccordion("opiskelijapalaute")}
      >
        {palauteTilat.length ? (
          palauteTilat.map(
            (palauteTila: IOpiskelijapalauteTila, index: number) => (
              <React.Fragment key={"opiskelijapalaute_" + index}>
                <InfoTable>
                  <tbody>
                    <tr>
                      <th>
                        <FormattedMessage
                          id="tavoitteet.opiskelijapalauteTilaTitle"
                          defaultMessage="Opiskelijapalautteen tila"
                        />
                      </th>
                      <th>
                        <FormattedMessage
                          id="tavoitteet.opiskelijapalauteSahkopostiTitle"
                          defaultMessage="Opiskelijan sähköpostiosoite"
                        />
                      </th>
                      <th>
                        <FormattedMessage
                          id="tavoitteet.opiskelijapalauteTyyppiTitle"
                          defaultMessage="Kyselyn tyyppi"
                        />
                      </th>
                      <th>
                        <FormattedMessage
                          id="tavoitteet.opiskelijapalautePaattymispvmTitle"
                          defaultMessage="Vastaamisajan päättymispäivä"
                        />
                      </th>
                    </tr>
                    <tr>
                      <LabeledColumn id="tavoitteet.opiskelijapalauteTilaTitle">
                        <FormattedMessage
                          id="tavoitteet.opiskelijapalauteTila"
                          defaultMessage="Viesti on lähetetty {date} opiskelijalle"
                          values={{
                            date: (
                              <FormattedDate date={palauteTila.lahetyspvm} />
                            )
                          }}
                        />
                      </LabeledColumn>
                      <LabeledColumn id="tavoitteet.opiskelijapalauteSahkopostiTitle">
                        {palauteTila.sahkoposti}
                      </LabeledColumn>
                      <LabeledColumn id="tavoitteet.opiskelijapalauteTyyppiTitle">
                        <FormattedMessage
                          id={
                            "tavoitteet.opiskelijapalauteTyyppi." +
                            palauteTila.tyyppi
                          }
                          defaultMessage={palauteTila.tyyppi}
                        />
                      </LabeledColumn>
                      <LabeledColumn id="tavoitteet.opiskelijapalautePaattymispvmTitle">
                        <FormattedDate date={palauteTila.voimassaLoppupvm} />
                      </LabeledColumn>
                    </tr>
                  </tbody>
                </InfoTable>
                <Button
                  onClick={this.resendPalaute({
                    alkupvm: palauteTila.alkupvm,
                    tyyppi: palauteTila.tyyppi
                  })}
                >
                  Lähetä linkki opiskelijapalautekyselyyn uudestaan
                </Button>
              </React.Fragment>
            )
          )
        ) : (
          <p>Ei palautteita</p>
        )}
      </Accordion>
    )
  }
}
