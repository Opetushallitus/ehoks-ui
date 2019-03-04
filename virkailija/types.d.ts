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
    onClick?: () => void
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
  }

  const IconButton: React.SFC<IconButtonProps>
  export default IconButton
}
