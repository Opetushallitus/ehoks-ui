import React from "react"
import { useIntl } from "react-intl"

export const LabeledColumn = (props: {
  children?: React.ReactNode
  id: string
}) => {
  const intl = useIntl()
  return (
    <td
      data-label={intl.formatMessage({
        id: props.id
      })}
    >
      {props.children}
    </td>
  )
}
