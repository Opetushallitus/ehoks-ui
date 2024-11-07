import * as React from "react"
import { MdAlarm } from "react-icons/md"
import styled from "styled"

const StyledAlarm = styled(MdAlarm)`
  cursor: pointer;
  width: 64px;
  height: 64px;
  margin: 4px 0 4px 30px;

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    margin: 4px 0 4px 20px;
  }
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
      <StyledAlarm onClick={props.onClick} />
    </React.Fragment>
  )
}
