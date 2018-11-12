import React from "react"
import { MdCheck, MdHelp, MdWarning } from "react-icons/md"
import styled from "styled"

const Container = styled("div")`
  display: flex;
  align-items: center;
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  border-color: ${(props: { theme?: any; type: NotificationType }) =>
    props.theme.colors.notification[`${props.type}Border`]};
  background: ${(props: { theme?: any; type: NotificationType }) =>
    props.theme.colors.notification[`${props.type}Bg`]};
  min-height: 50px;
`

const IconContainer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: ${(props: { theme?: any; type: NotificationType }) =>
    props.theme.colors.notification[`${props.type}Border`]};
`

const Content = styled("div")`
  display: flex;
  flex: 1;
  padding-left: 20px;
  font-size: 14px;
  color: #313541;
`

const Icon = ({ type }: { type: string }) => {
  const props = { color: "#fff", size: 18 }
  switch (type) {
    case "success":
      return <MdCheck {...props} />
    case "question":
      return <MdHelp {...props} />
    case "error":
      return <MdWarning {...props} />
    case "warning":
      return <MdWarning {...props} />
    default:
      return null
  }
}

export type NotificationType = "success" | "question" | "error" | "warning"

export interface NotificationProps {
  /** Custom CSS class name for container */
  className?: string
  /**
   * Type of notfication (success, question, error, warning)
   * @default success
   */
  type?: NotificationType
}

/**
 * Notification based on styleguide styles
 */
export class Notification extends React.Component<NotificationProps> {
  render() {
    const { children, className, type = "success" } = this.props
    return (
      <Container className={className} type={type} role="alert">
        <IconContainer type={type}>
          <Icon type={type} />
        </IconContainer>
        <Content>{children}</Content>
      </Container>
    )
  }
}
