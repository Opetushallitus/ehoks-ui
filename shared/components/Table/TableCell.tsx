import React from "react"
import styled from "styled"

const Container = styled("td")`
  border-bottom: 1px solid ${props => props.theme.colors.table.cellBorder};
  padding: 15px 0;
  text-align: left;

  a {
    color: ${props => props.theme.colors.links.active};
  }
`

export class TableCell extends React.Component {
  render() {
    const { children } = this.props
    return <Container>{children}</Container>
  }
}
