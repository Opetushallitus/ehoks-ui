import React from "react"
import { WidgetProps } from "@rjsf/utils"

export const CustomBooleanRadioButtonWidget: React.FC<WidgetProps> = ({
  value,
  required,
  autofocus = false,
  onChange,
  id
}) => {
  // Generating a unique field name to identify this set of radio buttons
  const name = Math.random().toString()
  const enumOptions = [
    { value: true, label: "Kyllä" },
    { value: false, label: "Ei" }
  ]

  return (
    <div id={id}>
      {enumOptions.map((option: any, i: number) => {
        const radio = (
          <span>
            <input
              type="radio"
              checked={option.value === value}
              aria-checked={option.value === value}
              name={name}
              required={required}
              value={option.value}
              // TODO The autoFocus prop should not be used, as it can reduce usability and accessibility for users
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={autofocus && i === 0}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </span>
        )

        return (
          <div key={i}>
            <label>{radio}</label>
          </div>
        )
      })}
    </div>
  )
}
