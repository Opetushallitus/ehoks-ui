import React from "react"
import styled from "styled"

export interface ListContainerProps {
  className?: string
}

const Container = styled("div")`
  padding: 10px 15px;
  background-color: #fff;
  border-radius: 4px;
`

export class ListContainer extends React.Component<ListContainerProps> {
  render() {
    const { className, children } = this.props
    return <Container className={className}>{children}</Container>
  }
}
