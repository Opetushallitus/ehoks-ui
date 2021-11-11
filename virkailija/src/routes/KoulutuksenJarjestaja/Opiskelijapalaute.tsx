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
import { appendCommonHeaders } from "fetchUtils"

export interface OpiskelijapalauteProps {
  store?: IRootStore
  open?: boolean
  toggleAccordion: (accordion: string) => () => void
  hoksID: number
  oppijaOid: string
  title: React.ReactNode
  palauteTilat: IOpiskelijapalauteTila[]
}

interface ResendParameters {
  tyyppi: string
}

@inject("store")
@observer
export class Opiskelijapalaute extends React.Component<
  OpiskelijapalauteProps & RouteComponentProps
> {
  resendPalaute = (data: ResendParameters) => async (): Promise<void> => {
    const { hoksID, oppijaOid } = this.props
    const { notifications } = this.props.store!

    const response: Response = await window.fetch(
      `/ehoks-virkailija-backend/api/v1/virkailija/oppijat/${oppijaOid}/hoksit/${hoksID}/resend-palaute`,
      {
        method: "POST",
        credentials: "include",
        headers: appendCommonHeaders(
          new Headers({
            Accept: "application/json; charset=utf-8",
            "Content-Type": "application/json"
          })
        ),
        body: JSON.stringify(data)
      }
    )

    if (response.ok) {
      const json = await response.json()
      notifications.addNotifications([
        {
          title: "Opiskelijapalaute.resendPalaute.success",
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
        helpIcon={true}
        helpContent={
          <FormattedMessage id="tavoitteet.opiskelijapalauteTitle.help" />
        }
        helpCssWidth="400px"
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
                          id={
                            "tavoitteet.opiskelijapalauteTila." +
                            palauteTila.lahetystila
                          }
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
                {!(
                  Date.now() > new Date(palauteTila.voimassaLoppupvm).getTime()
                ) && (
                  <Button
                    onClick={this.resendPalaute({
                      tyyppi: palauteTila.tyyppi
                    })}
                  >
                    <FormattedMessage
                      id="tavoitteet.opiskelijapalauteResendButton"
                      defaultMessage="Lähetä linkki opiskelijapalautekyselyyn uudestaan"
                    />
                  </Button>
                )}
              </React.Fragment>
            )
          )
        ) : (
          <FormattedMessage
            id="tavoitteet.opiskelijapalauteEiPalautteita"
            defaultMessage="Ei aktiivisia vastauslinkkejä"
          />
        )}
      </Accordion>
    )
  }
}
