import React from "react"
import {
  WidgetProps,
  FieldProps,
  FieldTemplateProps
} from "react-jsonschema-form"

interface CustomBaseInputProps
  extends WidgetProps,
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
    options,
    schema,
    formContext,
    registry,
    rawErrors,
    ...inputProps
  } = props

  const _onChange = ({ target }: { target: { value: string } }) => {
    return props.onChange(target.value === "" ? "" : target.value)
  }

  return (
    <>
      {[
        <input
          type="date"
          key={inputProps.id}
          className="form-control"
          readOnly={readonly}
          disabled={disabled}
          autoFocus={autofocus}
          value={value == null ? "" : value}
          {...inputProps}
          list={schema.examples ? `examples_${inputProps.id}` : undefined}
          onChange={_onChange}
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
              // @ts-ignore
              ...new Set(
                schema.examples.concat(schema.default ? [schema.default] : [])
              )
            ].map(example => (
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
