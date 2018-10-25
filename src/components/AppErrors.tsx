import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import React from "react"
import { MdClose } from "react-icons/md"
import { FormattedMessage } from "react-intl"
import { AppError } from "stores/ErrorStore"
import { IRootStore } from "stores/RootStore"
import styled from "styled"
import { Container } from "./Container"
import { Notification } from "./Notification"

const ErrorNotification = styled(Notification)`
  margin: 20px 0;
`

const ErrorContent = styled("div")`
  display: flex;
  flex: 1;
  align-items: center;
`

const Text = styled("div")`
  flex: 1;
`

const IconContainer = styled("div")`
  display: flex;
  margin: 0 20px;
  cursor: pointer;
`

export interface AppErrorsProps {
  store?: IRootStore
}

@inject("store")
@observer
export class AppErrors extends React.Component<AppErrorsProps> {
  render() {
    const { store } = this.props
    const {
      errors: { unhandled }
    } = store
    return (
      <Container>
        {unhandled.map((error: Instance<typeof AppError>, i) => {
          return (
            <ErrorNotification key={i} type="error">
              <ErrorContent>
                <Text>
                  <FormattedMessage
                    id={`errors.${error.id}`}
                    defaultMessage={error.defaultMessage}
                  />
                  : {error.errorText}
                </Text>
                <IconContainer>
                  <MdClose size={20} onClick={error.handle} />
                </IconContainer>
              </ErrorContent>
            </ErrorNotification>
          )
        })}
      </Container>
    )
  }
}
