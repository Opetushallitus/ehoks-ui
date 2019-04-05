import range from "lodash.range"
import React, { useCallback, useState } from "react"
import { UiSchema } from "react-jsonschema-form"
import IconButton from "react-jsonschema-form/lib/components/IconButton"
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
  margin-top: 5px;
`

const ItemButtonsContainer = styled("div")`
  display: flex;
  padding-bottom: 5px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
`

const ItemButtons = styled("div")`
  display: flex;
  flex: 1;
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
  font-size: 16px;
  font-weight: bold;
  background: ${props => (props.active ? "#1976d2" : "#fff")};
  color: ${props => (props.active ? "#fff" : "#ccc")};
  border: ${props => (props.active ? "none" : "1px solid #ccc")};
`

const ArrayHeader = styled("div")`
  display: flex;
`

const DescriptionContainer = styled("div")`
  flex: 1;
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
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onAddClick(event)
      setActiveStep(_ => {
        return items.length
      })
    },
    [onAddClick, setActiveStep, items]
  )
  const activeProps = items[activeStep]
  // TODO: confirm deletion
  const onRemove = useCallback(() => {
    activeProps.onDropIndexClick(activeStep)()
    setActiveStep((i: number) => {
      if (i > 0) {
        return i - 1
      } else {
        return 0
      }
    })
  }, [activeProps, activeStep])

  console.log("ACC", activeProps)

  return (
    <ArrayField className={className} id={idSchema.$id}>
      <ArrayHeader>
        {(uiSchema["ui:description"] || schema.description) && (
          <DescriptionContainer>
            <ArrayFieldDescription
              key={`array-field-description-${idSchema.$id}`}
              DescriptionField={DescriptionField}
              idSchema={idSchema}
              description={uiSchema["ui:description"] || schema.description}
              isRoot={isRoot}
            />
          </DescriptionContainer>
        )}
        {canAdd && (
          <IconButton
            type="info"
            icon="plus"
            className="btn-add"
            tabIndex={0}
            onClick={onAdd}
            disabled={disabled || readonly}
          />
        )}
      </ArrayHeader>
      <ArrayItemList
        className="row array-item-list"
        key={`array-item-list-${idSchema.$id}`}
      >
        <ItemButtonsContainer>
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
          {items.length > 0 && (
            <IconButton
              type="danger"
              icon="remove"
              className="array-item-remove"
              tabIndex={-1}
              disabled={disabled || readonly}
              onClick={onRemove}
            />
          )}
        </ItemButtonsContainer>
        {activeProps && (
          <ArrayItem {...activeProps} setActiveStep={setActiveStep} />
        )}
      </ArrayItemList>
    </ArrayField>
  )
}
