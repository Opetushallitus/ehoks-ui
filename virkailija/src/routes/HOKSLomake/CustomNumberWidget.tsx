import React, { useState } from "react"
import { WidgetProps } from "react-jsonschema-form"

export const CustomNumberWidget = (props: WidgetProps) => {
  const { id, onBlur, onChange, onFocus, value } = props
  const [displayedValue, updateDisplayedValue] = useState(value || "")

  return (
    <input
      type="text"
      className="form-control"
      id={id}
      onBlur={onBlur && (event => onBlur(id, event.target.value))}
      onChange={event => {
        onChange(event.target.value.replace(",", "."))
        updateDisplayedValue(event.target.value)
      }}
      onFocus={onFocus && (event => onFocus(id, event.target.value))}
      value={displayedValue}
    />
  )
}
