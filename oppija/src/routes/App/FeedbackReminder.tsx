import * as React from "react"
import { MdAlarm } from "react-icons/md"

interface FeedbackReminderProps {
  showReminder: boolean
}

export function FeedbackReminder(props: FeedbackReminderProps) {
  if (!props.showReminder) {
    return null
  }

  return (
    <React.Fragment>
      <MdAlarm size={60} />
    </React.Fragment>
  )
}
