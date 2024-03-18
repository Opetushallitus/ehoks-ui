import { Link } from "react-router-dom"
import { AppContext } from "components/AppContext"
import { Container } from "components/Container"
import { Notification } from "components/Notification"
import { FormattedDate } from "components/FormattedDate"
import { inject, observer } from "mobx-react"
import React, { useContext } from "react"
import { MdClose } from "react-icons/md"
import { FormattedMessage, useIntl } from "react-intl"
import { IAppError } from "stores/ErrorStore"
import { IRootStore } from "stores/RootStore"
import styled from "styled"

const AppNotification = styled(Notification)`
  margin: 0;
`

const Content = styled("div")`
  display: flex;
  flex: 1;
  align-items: center;
`

const Text = styled("div")`
  flex: 1;
  font-size: 16px;
`

const IconContainer = styled("button")`
  display: flex;
  margin: 0 20px;
  cursor: pointer;
  appearance: none;
  padding: 0;
  border: none;
  background: transparent;
`

const NotificationLink = styled(Link)`
  color: ${props => props.theme.colors.green700};
  font-size: 16px;
  margin-right: 10px;
  cursor: pointer;
  text-decoration: underline;
`

const NotificationAnchor = NotificationLink.withComponent("a")

const AlertType = ({ type }: { type: string }) =>
  type === "naytto" ? (
    <FormattedMessage id="muistutukset.naytto" defaultMessage="Näyttö" />
  ) : (
    <FormattedMessage
      id="muistutukset.tyossaoppiminen"
      defaultMessage="Työssäoppiminen"
    />
  )

export interface AppNotificationsProps {
  store?: IRootStore
}

export const AppNotifications = inject("store")(
  observer((props: AppNotificationsProps) => {
    const ackNotification = (hide: () => void) => (event: React.MouseEvent) => {
      event.preventDefault()
      hide()
    }

    const { store } = props
    const intl = useIntl()
    const { featureFlags } = useContext(AppContext)
    const {
      errors: { unhandled },
      notifications
    } = store!
    return (
      <Container>
        {unhandled.map((error: IAppError, i: number) => (
          <AppNotification key={i} type="error">
            <Content>
              <Text>
                <FormattedMessage id={`errors.${error.id}`} />:{" "}
                <FormattedMessage
                  id={`errors.${error.errorText}`}
                  defaultMessage={error.errorText}
                />
              </Text>
              <IconContainer
                onClick={error.handle}
                aria-label={intl.formatMessage({
                  id: "errors.piilotaVirheAriaLabel"
                })}
              >
                <MdClose size={20} />
              </IconContainer>
            </Content>
          </AppNotification>
        ))}
        {featureFlags.shareNotifications &&
          notifications.visible.map((notification, i) => {
            const message = notification.message
            return (
              <AppNotification
                key={i}
                type="alert"
                iconColor="#000"
                iconSize={32}
              >
                <Content>
                  <Text>
                    <AlertType type={message.type} />, {message.title},{" "}
                    {message.location}{" "}
                    <FormattedDate date={message.startDate} format="d.M." />-
                    <FormattedDate date={message.endDate} />{" "}
                    <FormattedMessage
                      id="muistutukset.onPianAlkamassa"
                      defaultMessage="on pian alkamassa"
                    />
                    .
                  </Text>
                  <NotificationLink
                    to={`/ehoks/suunnittelu/${message.hoksId}/opiskelusuunnitelmani?share=${message.koodiUri}&type=${message.type}`}
                  >
                    <FormattedMessage
                      id="muistutukset.jaaTiedotTyopaikkaohjaajalle"
                      defaultMessage="Jaa tiedot työpaikkaohjaajalle"
                    />
                    .
                  </NotificationLink>
                  <NotificationAnchor
                    role="button"
                    href="#"
                    onClick={ackNotification(notification.ackNotification)}
                  >
                    <FormattedMessage
                      id="muistutukset.poistaMuistutus"
                      defaultMessage="Poista muistutus"
                    />
                    .
                  </NotificationAnchor>
                  <IconContainer
                    onClick={notification.hide}
                    aria-label={intl.formatMessage({
                      id: "errors.piilotaVirheAriaLabel"
                    })}
                  >
                    <MdClose size={20} />
                  </IconContainer>
                </Content>
              </AppNotification>
            )
          })}
      </Container>
    )
  })
)

export default AppNotifications
