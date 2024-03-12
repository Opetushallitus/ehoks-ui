import React from "react"
import { isMultiSelect, getUiOptions, isFilesArray } from "@rjsf/utils"
import validator from "@rjsf/validator-ajv8"

const REQUIRED_FIELD_SYMBOL = "*"

export function Label(props: any) {
  const { label, required, id } = props
  if (!label) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />
  }
  return (
    <label key={0} className="control-label" htmlFor={id}>
      {label}
      {required && <span className="required">{REQUIRED_FIELD_SYMBOL}</span>}
    </label>
  )
}

export function DefaultLabel({
  schema,
  uiSchema,
  definitions,
  required,
  id,
  name,
  formContext,
  registry
}: any) {
  const uiOptions = getUiOptions(uiSchema)
  let { label: displayLabel = true } = uiOptions
  const { forceLabelDisplay } = uiOptions
  if (schema.type === "array") {
    displayLabel =
      isMultiSelect(validator, schema, definitions) ||
      isFilesArray(validator, schema, uiSchema, definitions)
  }
  if (schema.type === "object") {
    displayLabel = false
  }
  if (schema.type === "boolean" && !uiSchema["ui:widget"]) {
    displayLabel = false
  }

  const label = uiSchema!["ui:title"] || schema.title || name
  const description = uiSchema!["ui:description"] || schema.description

  const DescriptionField = registry.fields.DescriptionField

  if (displayLabel || forceLabelDisplay) {
    return (
      <React.Fragment>
        <Label key={0} label={label} required={required} id={id} />
        {description && (
          <DescriptionField
            key={1}
            id={id + "__description"}
            description={description}
            formContext={formContext}
          />
        )}
      </React.Fragment>
    )
  }

  return null
}
