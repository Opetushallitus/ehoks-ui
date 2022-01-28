import range from "lodash.range"
import React, { useCallback, useState } from "react"
import { UiSchema } from "@rjsf/core"
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

interface ItemButtonsContainerProps {
  active: boolean
}
const ItemButtonsContainer = styled("div")<ItemButtonsContainerProps>`
  display: flex;
  padding-bottom: 5px;
  margin-bottom: 10px;
  border-bottom: ${props => (props.active ? "1px solid #ccc" : "unset")};
`

const ItemButtons = styled("div")`
  display: flex;
  flex: 1;
`

const AddButton = styled("button")`
  display: inline-block;
  padding: 10px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  user-select: none;
  background-image: none;
  border: 1px solid transparent;
  border-radius: 2px;
  color: #fff;
  background-color: #1976d2;
  border-color: #1976d2;
  min-width: 85px;
`

const RemoveButton = styled(AddButton)`
  background-color: ${props => props.theme.colors.battleshipGrey};
  border-color: ${props => props.theme.colors.battleshipGrey};
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
      setActiveStep(() => items.length)
    },
    [onAddClick, setActiveStep, items]
  )
  const activeProps = items[activeStep]

  const onRemove = useCallback(() => {
    if (window.confirm("Haluatko varmasti poistaa valitut tiedot?")) {
      activeProps.onDropIndexClick(activeStep)()
      setActiveStep((i: number) => {
        if (i > 0) {
          return i - 1
        } else {
          return 0
        }
      })
    }
  }, [activeProps, activeStep])

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
          <AddButton
            type="button"
            tabIndex={0}
            disabled={disabled || readonly}
            onClick={onAdd}
          >
            Lisää <i className={`glyphicon glyphicon-plus`} />
          </AddButton>
        )}
      </ArrayHeader>
      <ArrayItemList
        className="row array-item-list"
        key={`array-item-list-${idSchema.$id}`}
      >
        <ItemButtonsContainer active={items.length > 0}>
          <ItemButtons>
            {range(items.length).map(index => (
              <ItemButton
                key={index}
                active={activeStep === index}
                onClick={() => setActiveStep(index)}
              >
                {index + 1}
              </ItemButton>
            ))}
          </ItemButtons>
          {items.length > 0 && (
            <RemoveButton
              type="button"
              tabIndex={-1}
              disabled={disabled || readonly}
              onClick={onRemove}
            >
              Poista <i className={`glyphicon glyphicon-remove`} />
            </RemoveButton>
          )}
        </ItemButtonsContainer>
        {activeProps && (
          <ArrayItem {...activeProps} setActiveStep={setActiveStep} />
        )}
      </ArrayItemList>
    </ArrayField>
  )
}
