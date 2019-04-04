import range from "lodash.range"
import React, { useCallback, useState } from "react"
import { UiSchema } from "react-jsonschema-form"
import AddButton from "react-jsonschema-form/lib/components/AddButton"
import styled from "styled"
import { ArrayFieldDescription } from "./ArrayFieldDescription"
import { ArrayItem } from "./ArrayItem"

interface ArrayFieldTemplateProps {
  className: string
  idSchema: { $id: string }
  schema: any
  uiSchema: UiSchema
  DescriptionField: any
  items: any[]
  canAdd: boolean
  onAddClick: any
  disabled: boolean
  readonly: boolean
  formContext: any
  title: string
}

const ArrayField = styled("fieldset")``

const ArrayItemList = styled("div")`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
`

const ItemButtons = styled("div")`
  display: flex;
`

interface ItemButtonProps {
  active?: boolean
}
const ItemButton = styled("button")<ItemButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background: ${props => (props.active ? "#1976d2" : "#fff")};
  color: ${props => (props.active ? "#fff" : "#ddd")};
  border: ${props => (props.active ? "none" : "1px solid #ddd")};
`

export function ArrayFieldTemplate(props: ArrayFieldTemplateProps) {
  const {
    canAdd,
    className,
    DescriptionField,
    disabled,
    formContext,
    idSchema,
    items,
    onAddClick,
    readonly,
    schema,
    title,
    uiSchema
  } = props

  const isRoot = formContext.isRoot(title)
  const [activeStep, setActiveStep] = useState(0)
  const onAdd = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      onAddClick(event)
      setActiveStep(step => {
        if (items.length) {
          return step + 1
        } else {
          return step
        }
      })
    },
    [onAddClick, setActiveStep, items]
  )
  const activeProps = items[activeStep]

  return (
    <ArrayField className={className} id={idSchema.$id}>
      {canAdd && (
        <AddButton
          className="array-item-add"
          onClick={onAdd}
          disabled={disabled || readonly}
        />
      )}
      {(uiSchema["ui:description"] || schema.description) && (
        <ArrayFieldDescription
          key={`array-field-description-${idSchema.$id}`}
          DescriptionField={DescriptionField}
          idSchema={idSchema}
          description={uiSchema["ui:description"] || schema.description}
          isRoot={isRoot}
        />
      )}
      <ArrayItemList
        className="row array-item-list"
        key={`array-item-list-${idSchema.$id}`}
      >
        <ItemButtons>
          {range(items.length).map(index => {
            return (
              <ItemButton
                key={index}
                active={activeStep === index}
                onClick={() => setActiveStep(index)}
              >
                {index + 1}
              </ItemButton>
            )
          })}
        </ItemButtons>
        {activeProps && (
          <ArrayItem {...activeProps} setActiveStep={setActiveStep} />
        )}
      </ArrayItemList>
    </ArrayField>
  )
}
