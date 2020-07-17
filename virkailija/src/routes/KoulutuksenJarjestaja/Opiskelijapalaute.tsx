import { Accordion } from "components/Accordion"
import { InfoTable } from "components/InfoTable"
import { LabeledColumn } from "components/LabeledColumn"
import { inject, observer } from "mobx-react"
import React from "react"
import { FormattedMessage } from "react-intl"
import { FormattedDate } from "components/FormattedDate"
import { RouteComponentProps } from "@reach/router"
import { IOpiskelijapalauteTila } from "models/OpiskelijapalauteTila"
import { Button } from "components/Button"
import { IRootStore } from "../../stores/RootStore"

export interface OpiskelijapalauteProps {
  store?: IRootStore
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

@inject("store")
@observer
export class Opiskelijapalaute extends React.Component<
  OpiskelijapalauteProps & RouteComponentProps
> {
  resendPalaute = (data: IResend) => async (): Promise<void> => {
    const { hoksID, oppijaOid } = this.props
    const { notifications } = this.props.store!

    const response: Response = await window.fetch(
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

    if (response.ok) {
      const json = await response.json()
      notifications.addNotifications([
        {
          title: "opiskelijapalauteResendSuccess",
          source: "Opiskelijapalaute",
          sahkoposti: json.data.sahkoposti,
          default:
            "Sähköposti opiskelijapalautteesta lähetetään osoitteeseen {sahkoposti}.",
          tyyppi: "success"
        }
      ])
    } else {
      notifications.addError(
        "Opiskelijapalaute.resendPalaute",
        response.statusText
      )
    }
  }

  componentWillUnmount(): void {
    const { notifications } = this.props.store!
    notifications.removeNotificationsBySource("Opiskelijapalaute")
  }

  render(): React.ReactNode {
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
                  <FormattedMessage
                    id="tavoitteet.opiskelijapalauteResendButton"
                    defaultMessage="Lähetä linkki opiskelijapalautekyselyyn uudestaan"
                  />
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
