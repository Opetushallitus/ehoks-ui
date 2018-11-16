import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import React from "react"
import { MdClose } from "react-icons/md"
import { FormattedMessage, intlShape } from "react-intl"
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

const IconContainer = styled("button")`
  display: flex;
  margin: 0 20px;
  cursor: pointer;
  appearance: none;
  padding: 0;
  border: none;
  background: transparent;
`

export interface AppErrorsProps {
  store?: IRootStore
}

@inject("store")
@observer
export class AppErrors extends React.Component<AppErrorsProps> {
  static contextTypes = {
    intl: intlShape
  }
  render() {
    const { store } = this.props
    const { intl } = this.context
    const {
      errors: { unhandled }
    } = store!
    return (
      <Container>
        {unhandled.map((error: Instance<typeof AppError>, i: number) => {
          return (
            <ErrorNotification key={i} type="error">
              <ErrorContent>
                <Text>
                  <FormattedMessage id={`errors.${error.id}`} />:{" "}
                  {error.errorText}
                </Text>
                <IconContainer
                  onClick={error.handle}
                  aria-label={intl.formatMessage({
                    id: "errors.piilotaVirheAriaLabel"
                  })}
                >
                  <MdClose size={20} />
                </IconContainer>
              </ErrorContent>
            </ErrorNotification>
          )
        })}
      </Container>
    )
  }
}
