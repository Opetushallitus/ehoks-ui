import { Accordion } from "components/Accordion"
import { InfoTable } from "components/InfoTable"
import { LabeledColumn } from "components/LabeledColumn"
import { inject, observer } from "mobx-react"
import React, { useEffect } from "react"
import { useIntl, FormattedMessage } from "react-intl"
import { FormattedDate } from "components/FormattedDate"
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

export const Opiskelijapalaute = inject("store")(
  observer((props: OpiskelijapalauteProps) => {
    const resendPalaute = (data: ResendParameters) => async (): Promise<
      void
    > => {
      const { hoksID, oppijaOid } = props
      const { notifications } = props.store!

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

    useEffect(
      () => () => {
        const { notifications } = props.store!
        notifications.removeNotificationsBySource("Opiskelijapalaute")
      },
      []
    )

    const { palauteTilat } = props
    const intl = useIntl()

    return (
      <Accordion
        id="henkilotiedot"
        open={props.open}
        title={props.title}
        onToggle={props.toggleAccordion("opiskelijapalaute")}
        helpIcon={true}
        helpContent={
          <FormattedMessage
            id="tavoitteet.opiskelijapalauteTitle.help"
            defaultMessage="Opiskelijapalautteen otiskon help: {link}"
            values={{
              link: (
                <a
                  href={intl.formatMessage({
                    id: "tavoitteet.opiskelijapalauteTitle.help.link",
                    defaultMessage:
                      "https://wiki.eduuni.fi/pages/viewpage.action?pageId=190612670"
                  })}
                >
                  {intl.formatMessage({
                    id: "tavoitteet.opiskelijapalauteTitle.help.link",
                    defaultMessage:
                      "https://wiki.eduuni.fi/pages/viewpage.action?pageId=190612670"
                  })}
                </a>
              )
            }}
          />
        }
        helpCssWidth="300px"
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
                    onClick={resendPalaute({
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
  })
)
