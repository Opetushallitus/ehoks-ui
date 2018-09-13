import React from "react"
import styled from "react-emotion"

import { MdExpandLess, MdExpandMore } from "react-icons/md"

const AccordionContainer = styled("div")`
  padding: 20px 0 10px 0;
`

const Toggle = styled("div")`
  border-radius: 15px;
  width: 30px;
  height: 30px;
  border: 1px solid #027fa9;
  cursor: pointer;
`

const TitleRow = styled("div")`
  display: flex;
  align-items: center;
`

const Title = styled("h2")`
  margin: 0 0 0 20px;
  font-size: 20px;
  font-weight: 400;
`

const Content = styled("div")`
  margin: 10px 10px 10px 50px;
  border-radius: 4px;
  border: 1px solid #a8a8a8;
  background: #fff;
  padding: 10px;
`

export interface AccordionProps {
  open?: boolean
  onToggle?: () => void
  title?: string
  helpIcon?: boolean
  helpContent?: React.ReactNode
}

export class Accordion extends React.Component<AccordionProps> {
  render() {
    const { children, onToggle, open, title } = this.props
    return (
      <AccordionContainer>
        <TitleRow>
          <Toggle onClick={onToggle}>
            {open ? (
              <MdExpandLess size="28" color="#027fa9" />
            ) : (
              <MdExpandMore size="28" color="#027fa9" />
            )}
          </Toggle>
          <Title>{title}</Title>
        </TitleRow>
        {open ? <Content>{children}</Content> : null}
      </AccordionContainer>
    )
  }
}
