import React from "react"
import styled from "styled"

const Container = styled("td")(
  ({ theme }) => `
  border-bottom: 1px solid ${theme.colors.table.cellBorder};
  padding: ${theme.spacing.m} ${theme.spacing.s} ${theme.spacing.m} 0;
  text-align: left;
  word-break: break-word;

  a {
    color: ${theme.colors.links.active};
  }
`
)

interface TableCellProps {
  colSpan?: number
}

export class TableCell extends React.Component<TableCellProps> {
  render() {
    const { children, colSpan } = this.props
    return <Container colSpan={colSpan}>{children}</Container>
  }
}
