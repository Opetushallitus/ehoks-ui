import React from "react"
import {
  WidgetProps,
  FieldProps,
  FieldTemplateProps
} from "react-jsonschema-form"

interface CustomBaseInputProps
  extends Omit<WidgetProps, "rawErrors">,
    Partial<
      Pick<FieldProps, "registry"> & Pick<FieldTemplateProps, "rawErrors">
    > {
  placeholder?: string
}

/**
 * For custom DatetimeWidget
 * copied from react-jsonschema-form
 * and modified to TS and needs
 */
function CustomBaseInput(props: CustomBaseInputProps) {
  // Note: since React 15.2.0 we can't forward unknown element attributes, so we
  // exclude the "options" and "schema" ones here.
  if (!props.id) {
    console.log("No id for", props)
    throw new Error(`no id for props ${JSON.stringify(props)}`)
  }
  const {
    value,
    readonly,
    disabled,
    autofocus,
    onBlur,
    onFocus,
    schema,
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
            onBlur && (event => onBlur(inputProps.id, event.target.value))
          }
          onFocus={
            onFocus && (event => onFocus(inputProps.id, event.target.value))
          }
        />,
        schema.examples ? (
          <datalist id={`examples_${inputProps.id}`}>
            {[
              // TODO Type 'Set<JSONSchema6Type>' is not an array type or a string type
              // @ts-ignore
              ...new Set(
                schema.examples.concat(schema.default ? [schema.default] : [])
              )
            ].map(example => (
              // TODO Type 'JSONSchema6Type' is not assignable to type 'string | number | string[] | undefined'
              // @ts-ignore
              <option key={example} value={example} />
            ))}
          </datalist>
        ) : null
      ]}
    </>
  )
}

CustomBaseInput.defaultProps = {
  required: false,
  disabled: false,
  readonly: false,
  autofocus: false
}

export default CustomBaseInput
