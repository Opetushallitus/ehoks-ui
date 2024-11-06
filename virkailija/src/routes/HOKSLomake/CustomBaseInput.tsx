import React from "react"
import { WidgetProps } from "@rjsf/utils"

/* eslint-disable react/prop-types */
interface CustomBaseInputProps
  extends Omit<WidgetProps, "rawErrors" | "formContext"> {
  placeholder?: string
}

/**
 * For custom DatetimeWidget
 * copied from react-jsonschema-form
 * and modified to TS and needs
 */
const CustomBaseInput: React.FC<CustomBaseInputProps> = (props) => {
  // Note: since React 15.2.0 we can't forward unknown element attributes, so we
  // exclude the "options" and "schema" ones here.
  if (!props.id) {
    console.log("No id for", props)
    throw new Error(`no id for props ${JSON.stringify(props)}`)
  }
  const {
    value,
    readonly = false,
    disabled = false,
    autofocus = false,
    onBlur,
    onFocus,
    schema,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    uiSchema,
    ...inputProps
  } = props

  const onChange = ({ target }: { target: { value: string } }) =>
    props.onChange(target.value === "" ? "" : target.value)

  return (
    <>
      {[
        <input
          type="date"
          key={inputProps.id}
          className="form-control"
          readOnly={readonly}
          disabled={disabled}
          // TODO The autoFocus prop should not be used, as it can reduce usability and accessibility for users
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autofocus}
          value={value == null ? "" : value}
          {...inputProps}
          list={schema.examples ? `examples_${inputProps.id}` : undefined}
          onChange={onChange}
          onBlur={
            onBlur && ((event) => onBlur(inputProps.id, event.target.value))
          }
          onFocus={
            onFocus && ((event) => onFocus(inputProps.id, event.target.value))
          }
        />
      ]}
    </>
  )
}

export default CustomBaseInput
