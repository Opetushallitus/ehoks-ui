import * as React from "react"
import { MdAlarm } from "react-icons/md"
import styled from "styled"

const StyledAlarm = styled(MdAlarm)`
  cursor: pointer;
`

interface FeedbackReminderProps {
  hasFeedbackLinks: boolean
  onClick: () => void
}

export function FeedbackReminder(props: FeedbackReminderProps) {
  if (!props.hasFeedbackLinks) {
    return null
  }

  return (
    <React.Fragment>
      <StyledAlarm size={60} onClick={props.onClick} />
    </React.Fragment>
  )
}
