import React from "react"
import { InjectedIntl, intlShape } from "react-intl"

export const LabeledColumn = (
  props: { children?: React.ReactNode; id: string },
  context: { intl: InjectedIntl }
) => (
    <td
      data-label={context.intl.formatMessage({
        id: props.id
      })}
    >
      {props.children}
    </td>
  )
LabeledColumn.contextTypes = {
  intl: intlShape
}
