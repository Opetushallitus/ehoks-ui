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

interface TableCellProps {
  colSpan?: number
}

export class TableCell extends React.Component<TableCellProps> {
  render() {
    const { children, colSpan } = this.props
    return <Container colSpan={colSpan}>{children}</Container>
  }
}
