declare module "*.jpg"
declare module "*.png"
declare module "*.svg"

declare module "react-jsonschema-form/lib/components/fields/SchemaField" {
  import * as React from "react"
  import { FormProps } from "react-jsonschema-form"
  export default class SchemaField<T> extends React.Component<FormProps<T>> {}
}

declare module "react-jsonschema-form/lib/components/AddButton" {
  import * as React from "react"
  const AddButton: React.SFC<{
    className?: string
    onClick?: (event: React.FormEvent<HTMLInputElement>) => void
    disabled?: boolean
  }>
  export default AddButton
}

declare module "react-jsonschema-form/lib/components/IconButton" {
  import * as React from "react"

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
  import * as React from "react"
  interface DescriptionProps {
    id?: string
    description?: React.ReactNode
  }

  const DescriptionField: React.SFC<DescriptionProps>
  export default DescriptionField
}

declare module "react-jsonschema-form/lib/utils" {
  import { JSONSchema6 } from "json-schema"
  import { UiSchema } from "react-jsonschema-form"

  export function getUiOptions(schema: JSONSchema6): any
  export function isMultiSelect(schema: JSONSchema6, definitions: any): any
  export function isFilesArray(
    schema: JSONSchema6,
    uiSchema: UiSchema,
    definitions: any
  ): any
}
