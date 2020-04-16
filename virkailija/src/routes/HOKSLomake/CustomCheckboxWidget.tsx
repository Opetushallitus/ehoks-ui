import { Label } from "components/react-jsonschema-form/Label"
import React from "react"
import { CustomDescriptionField } from "./CustomDescriptionField"

// Check to see if a schema specifies that a value must be true
function schemaRequiresTrueValue(schema: any): boolean {
  // Check if const is a truthy value
  if (schema.const) {
    return true
  }

  // Check if an enum has a single value of true
  if (schema.enum && schema.enum.length === 1 && schema.enum[0] === true) {
    return true
  }

  // If anyOf has a single value, evaluate the subschema
  if (schema.anyOf && schema.anyOf.length === 1) {
    return schemaRequiresTrueValue(schema.anyOf[0])
  }

  // If oneOf has a single value, evaluate the subschema
  if (schema.oneOf && schema.oneOf.length === 1) {
    return schemaRequiresTrueValue(schema.oneOf[0])
  }

  // Evaluate each subschema in allOf, to see if one of them requires a true
  // value
  if (schema.allOf) {
    return schema.allOf.some(schemaRequiresTrueValue)
  }

  return false
}

export function CustomCheckboxWidget(props: any) {
  const {
    schema,
    id,
    value,
    disabled,
    readonly,
    label,
    autofocus,
    onBlur,
    onFocus,
    onChange,
    registry
  } = props

  const { fields = {} } = registry
  const DescriptionField = fields.DescriptionField || CustomDescriptionField

  // Because an unchecked checkbox will cause html5 validation to fail, only add
  // the "required" attribute if the field value must be "true", due to the
  // "const" or "enum" keywords
  const required = schemaRequiresTrueValue(schema)

  return (
    <div className={`checkbox ${disabled || readonly ? "disabled" : ""}`}>
      <Label id={id} required={required} label={label} />
      {schema.description && (
        <DescriptionField
          id={id + "__description"}
          description={schema.description}
        />
      )}
      <label>
        <input
          type="checkbox"
          id={id}
          checked={typeof value === "undefined" ? false : value}
          aria-checked={typeof value === "undefined" ? false : value}
          required={required}
          disabled={disabled || readonly}
          // TODO The autoFocus prop should not be used, as it can reduce usability and accessibility for users
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autofocus}
          onChange={event => onChange(event.target.checked)}
          onBlur={onBlur && (event => onBlur(id, event.target.checked))}
          onFocus={onFocus && (event => onFocus(id, event.target.checked))}
        />
        <span>{label}</span>
      </label>
    </div>
  )
}

CustomCheckboxWidget.defaultProps = {
  autofocus: false
}
