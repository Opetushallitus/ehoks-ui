import React from "react"
import styled from "styled"

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  text-align: center;
  width: 120px;
  margin-right: 30px;

  &:last-of-type {
    margin-right: 0;
  }
`

interface ItemProps {
  selected: boolean
}
const Item = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 90px;
  width: 90px;
  height: 90px;
  border: 4px solid #027fa9;
  background: ${(props: ItemProps) => (props.selected ? "#027FA9" : "#fff")};
`

const Title = styled("div")`
  margin-top: 10px;
  color: ${props => props.theme.colors.battleshipGrey};
  font-size: 20px;
  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    display: none;
  }
`

export interface SectionItemProps {
  /** Content inside circle */
  children?: React.ReactNode
  /** Text below circle */
  title?: React.ReactNode
  /** Selected circle has solid background without progress indicator */
  selected?: boolean
  /** Click handler function */
  onClick?: () => void
}

/**
 * Clickable circular progress button with title
 */
export class SectionItem extends React.Component<SectionItemProps> {
  render() {
    const { children, title, onClick, selected } = this.props
    return (
      <Container onClick={onClick}>
        <Item selected={selected}>{children}</Item>
        <Title>{title}</Title>
      </Container>
    )
  }
}
