import { Container } from "components/Container"
import { Notification, NotificationType } from "components/Notification"
import { inject, observer } from "mobx-react"
import React from "react"
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

export interface AppNotificationsProps {
  store?: IRootStore
}

export const AppNotifications = inject("store")(
  observer((props: AppNotificationsProps) => {
    const intl = useIntl()
    const {
      errors: { unhandled },
      notifications
    } = props.store!

    return (
      <Container>
        {unhandled.map((error: IAppError, i: number) => (
          <AppNotification key={i} type="error">
            <Content onClick={error.handle}>
              <Text>
                <FormattedMessage id={`errors.${error.id}`} />
                {!!error.errorText && <span>{": "}</span>}
                {!!error.errorText && (
                  <FormattedMessage
                    id={`errors.${error.errorText}`}
                    defaultMessage={error.errorText}
                  />
                )}
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
        {notifications.visible.map((notification, i) => {
          const message = notification.message
          return (
            <AppNotification
              key={i}
              type={message.type as NotificationType}
              iconColor="#000"
              iconSize={32}
            >
              <Content onClick={notification.hide}>
                <Text>
                  <FormattedMessage
                    id={"notification." + message.title}
                    defaultMessage={message.default}
                    values={message.values}
                  />
                </Text>
                <IconContainer
                  onClick={notification.hide}
                  aria-label={intl.formatMessage({
                    id: "notification.piilotaNotifikaatioAriaLabel"
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
