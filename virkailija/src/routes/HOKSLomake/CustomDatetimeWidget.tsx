import React from "react"
import { WidgetProps } from "react-jsonschema-form"
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
  // const { value, required, autofocus, onChange, id } = props
  const { value, onChange } = props
  return (
    <CustomBaseInput
      {...props}
      value={utcToLocalDate(value)}
      onChange={changedValue => onChange(localDateToUTC(changedValue))}
    />
  )
}

CustomDatetimeWidget.defaultProps = {
  autofocus: false
}