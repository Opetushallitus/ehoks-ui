import { JSONSchema6 } from "json-schema"
import React from "react"
import { UiSchema } from "react-jsonschema-form"
import AddButton from "react-jsonschema-form/lib/components/AddButton"
import IconButton from "react-jsonschema-form/lib/components/IconButton"

interface ArrayFieldProps {
  DescriptionField: any
  idSchema: { $id: string }
  description?: string
}

function ArrayFieldDescription({
  DescriptionField,
  idSchema,
  description
}: ArrayFieldProps) {
  if (!description) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />
  }
  const id = `${idSchema.$id}__description`
  return <DescriptionField id={id} description={description} />
}

interface DefaultArrayItemProps {
  index: number
  className: string
  hasToolbar: boolean
  children: React.ReactNode
  hasMoveUp: boolean
  hasMoveDown: boolean
  disabled: boolean
  readonly: boolean
  onReorderClick: any
  hasRemove: boolean
  onDropIndexClick: any
}

function DefaultArrayItem(props: DefaultArrayItemProps) {
  const btnStyle: React.CSSProperties = {
    flex: 1,
    paddingLeft: 6,
    paddingRight: 6,
    fontWeight: "bold"
  }
  return (
    <div key={props.index} className={props.className}>
      <div className={props.hasToolbar ? "col-xs-9" : "col-xs-12"}>
        {props.children}
      </div>

      {props.hasToolbar && (
        <div className="col-xs-3 array-item-toolbox">
          <div
            className="btn-group"
            style={{
              display: "flex",
              justifyContent: "space-around"
            }}
          >
            {(props.hasMoveUp || props.hasMoveDown) && (
              <IconButton
                icon="arrow-up"
                className="array-item-move-up"
                tabIndex={-1}
                style={btnStyle}
                disabled={props.disabled || props.readonly || !props.hasMoveUp}
                onClick={props.onReorderClick(props.index, props.index - 1)}
              />
            )}

            {(props.hasMoveUp || props.hasMoveDown) && (
              <IconButton
                icon="arrow-down"
                className="array-item-move-down"
                tabIndex={-1}
                style={btnStyle}
                disabled={
                  props.disabled || props.readonly || !props.hasMoveDown
                }
                onClick={props.onReorderClick(props.index, props.index + 1)}
              />
            )}

            {props.hasRemove && (
              <IconButton
                type="danger"
                icon="remove"
                className="array-item-remove"
                tabIndex={-1}
                style={btnStyle}
                disabled={props.disabled || props.readonly}
                onClick={props.onDropIndexClick(props.index)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface ArrayFieldTemplateProps {
  className: string
  idSchema: { $id: string }
  schema: JSONSchema6
  uiSchema: UiSchema
  DescriptionField: any
  items: any[]
  canAdd: boolean
  onAddClick: any
  disabled: boolean
  readonly: boolean
}

export function ArrayFieldTemplate(props: ArrayFieldTemplateProps) {
  return (
    <fieldset className={props.className} id={props.idSchema.$id}>
      {(props.uiSchema["ui:description"] || props.schema.description) && (
        <ArrayFieldDescription
          key={`array-field-description-${props.idSchema.$id}`}
          DescriptionField={props.DescriptionField}
          idSchema={props.idSchema}
          description={
            props.uiSchema["ui:description"] || props.schema.description
          }
        />
      )}
      <div
        className="row array-item-list"
        key={`array-item-list-${props.idSchema.$id}`}
      >
        {props.items && props.items.map((p: any) => DefaultArrayItem(p))}
      </div>
      {props.canAdd && (
        <AddButton
          className="array-item-add"
          onClick={props.onAddClick}
          disabled={props.disabled || props.readonly}
        />
      )}
    </fieldset>
  )
}
