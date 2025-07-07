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

export interface OpiskelijapalauteProps {
  store?: IRootStore
  open?: boolean
  toggleAccordion: (accordion: string) => () => void
  hoksID: number
  oppijaOid: string
  title: React.ReactNode
  palauteTilat: IOpiskelijapalauteTila[]
}

export const Opiskelijapalaute = inject("store")(
  observer((props: OpiskelijapalauteProps) => {
    const { notifications } = props.store!

    useEffect(
      () => () => {
        notifications.removeNotificationsBySource("Opiskelijapalaute")
      },
      [notifications]
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
                {
                  // FIXME: resend button disabled until the resend functionality is
                  // restored in palaute-backend.  (The functionality also needs to be
                  // fixed: it should add a resend request to the palaute instead of
                  // purging information about the already sent message.)
                  !(
                    Date.now() >
                    new Date(palauteTila.voimassaLoppupvm).getTime()
                  ) && (
                    <Button disabled>
                      <FormattedMessage
                        id="tavoitteet.opiskelijapalauteResendButton"
                        defaultMessage="Lähetä linkki opiskelijapalautekyselyyn uudestaan"
                      />
                    </Button>
                  )
                }
                <FormattedMessage
                  id="tavoitteet.opiskelijapalauteResendDisabled"
                  defaultMessage={
                    "Palautekyselyn uudelleenlähetys on väliaikaisesti " +
                    "poistettu käytöstä järjestelmäkehityksen ajaksi."
                  }
                />
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
