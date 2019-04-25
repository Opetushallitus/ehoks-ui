import React from "react"
import styled from "styled"

const Container = styled("button")`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  text-align: center;
  width: 200px;
  border: 0;
  background: transparent;
  padding: 0;

  svg {
    width: 54px;
    height: 54px;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    width: 100px;
    svg {
      width: 32px;
      height: 32px;
    }
  }
`

interface ItemProps {
  selected: boolean
}
const Item = styled("div")<ItemProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 90px;
  width: 90px;
  height: 90px;
  border: 4px solid #027fa9;
  background: ${props => (props.selected ? "#027FA9" : "#fff")};
  color: ${props => (props.selected ? "#fff" : "#000")};

  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    width: 58px;
    height: 58px;
  }
`

interface TitleProps {
  selected: boolean
}
const Title = styled("div")<TitleProps>`
  margin-top: 10px;
  color: ${props => props.theme.colors.battleshipGrey};
  font-size: 20px;
  font-weight: ${props => (props.selected ? 600 : 300)};
  @media screen and (max-width: ${props => props.theme.breakpoints.Tablet}px) {
    display: none;
  }
`

export interface SectionItemProps {
  /** Content inside circle */
  children?: React.ReactNode
  /** Text below circle */
  title?: React.ReactNode
  /** Selected circle has solid background */
  selected?: boolean
  /** Click handler function */
  onClick?: () => void
}

/**
 * Clickable circular navigation button with title
 */
export class SectionItem extends React.Component<SectionItemProps> {
  render() {
    const { children, title, onClick, selected = false } = this.props
    return (
      <Container onClick={onClick}>
        <Item selected={selected}>{children}</Item>
        <Title selected={selected}>{title}</Title>
      </Container>
    )
  }
}
