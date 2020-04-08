import * as React from "react"
import { JSONSchema6 } from "json-schema"
import { UiSchema, FormProps } from "react-jsonschema-form"
declare module "*.jpg"
declare module "*.png"
declare module "*.svg"

declare module "react-jsonschema-form/lib/components/fields/SchemaField" {
  export default class SchemaField<T> extends React.Component<FormProps<T>> {}
}

declare module "react-jsonschema-form/lib/components/AddButton" {
  const AddButton: React.SFC<{
    className?: string
    onClick?: (event: React.FormEvent<HTMLInputElement>) => void
    disabled?: boolean
  }>
  export default AddButton
}

declare module "react-jsonschema-form/lib/components/IconButton" {
  interface IconButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    type?: string
    icon?: string
    className?: string
    disabled?: boolean
    style?: React.CSSProperties
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  }

  const IconButton: React.SFC<IconButtonProps>
  export default IconButton
}

declare module "react-jsonschema-form/lib/components/fields/DescriptionField" {
  interface DescriptionProps {
    id?: string
    description?: React.ReactNode
  }

  const DescriptionField: React.SFC<DescriptionProps>
  export default DescriptionField
}

declare module "react-jsonschema-form/lib/utils" {
  export function getUiOptions(schema: JSONSchema6): any
  export function isMultiSelect(schema: JSONSchema6, definitions: any): any
  export function isFilesArray(
    schema: JSONSchema6,
    uiSchema: UiSchema,
    definitions: any
  ): any
}
