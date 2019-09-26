import React from "react"
import IconButton from "react-jsonschema-form/lib/components/IconButton"
import styled from "styled"

interface ArrayItemProps {
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
  setActiveStep: React.Dispatch<React.SetStateAction<number>>
}

const ArrayItemContainer = styled("div")`
  display: flex;
  flex: 1;
`

const FlexContainer = styled("div")`
  flex: 1;
`

export function ArrayItem(props: ArrayItemProps) {
  const {
    children,
    className,
    disabled,
    hasMoveDown,
    hasMoveUp,
    hasToolbar,
    index,
    onReorderClick,
    readonly
  } = props
  const btnStyle: React.CSSProperties = {
    flex: 1,
    paddingLeft: 6,
    paddingRight: 6,
    fontWeight: "bold"
  }

  return (
    <ArrayItemContainer key={index} className={className}>
      <FlexContainer>{children}</FlexContainer>

      {hasToolbar && (
        <div className="array-item-toolbox">
          <div
            className="btn-group"
            style={{
              display: "flex",
              justifyContent: "space-around"
            }}
          >
            {(hasMoveUp || hasMoveDown) && (
              <IconButton
                icon="arrow-up"
                className="array-item-move-up"
                tabIndex={-1}
                style={btnStyle}
                disabled={disabled || readonly || !hasMoveUp}
                onClick={onReorderClick(index, index - 1)}
              />
            )}
            {(hasMoveUp || hasMoveDown) && (
              <IconButton
                icon="arrow-down"
                className="array-item-move-down"
                tabIndex={-1}
                style={btnStyle}
                disabled={disabled || readonly || !hasMoveDown}
                onClick={onReorderClick(index, index + 1)}
              />
            )}
          </div>
        </div>
      )}
    </ArrayItemContainer>
  )
}
