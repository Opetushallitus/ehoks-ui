import React from "react"
import { WidgetProps } from "@rjsf/core"
import CustomBaseInput from "./CustomBaseInput"

function pad(num: number, size: number) {
  let s = String(num)
  while (s.length < size) {
    s = "0" + s
  }
  return s
}

function utcToLocalDate(jsonDate: string) {
  if (!jsonDate) {
    return ""
  }

  // required format of `"yyyy-MM-ddThh:mm" followed by optional ":ss" or ":ss.SSS"
  // https://html.spec.whatwg.org/multipage/input.html#local-date-and-time-state-(type%3Ddatetime-local)
  // > should be a _valid local date and time string_ (not GMT)

  // Note - date constructor passed local ISO-8601 does not correctly
  // change time to UTC in node pre-8
  const date = new Date(jsonDate)

  const yyyy = pad(date.getFullYear(), 4)
  const MM = pad(date.getMonth() + 1, 2)
  const dd = pad(date.getDate(), 2)

  return `${yyyy}-${MM}-${dd}`
}
function localDateToUTC(dateString: string) {
  if (dateString) {
    return new Date(dateString).toJSON()
  }
}

/** Copied from react-jsonschema-form
 * and modified to TS and needs
 */
export function CustomDatetimeWidget(props: WidgetProps) {
  const {
    value,
    onChange,
    readonly,
    disabled,
    autofocus,
    onBlur,
    onFocus,
    schema,
    uiSchema,
    id,
    label,
    options,
    multiple
  } = props
  return (
    <CustomBaseInput
      readonly={readonly}
      disabled={disabled}
      autofocus={autofocus}
      onBlur={onBlur}
      onFocus={onFocus}
      schema={schema}
      uiSchema={uiSchema}
      value={utcToLocalDate(value)}
      id={id}
      label={label}
      options={options}
      onChange={(changedValue: string) =>
        onChange(localDateToUTC(changedValue))
      }
      multiple={multiple}
    />
  )
}

CustomDatetimeWidget.defaultProps = {
  autofocus: false
}
