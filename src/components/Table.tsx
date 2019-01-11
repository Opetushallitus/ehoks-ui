import React from "react"
import styled from "styled"

interface TableContextProps {
  sortBy?: string
  sortDirection: string
  sortTitle: string
  onSort: (sortName: string) => void
}
export const TableContext = React.createContext<TableContextProps>({
  sortDirection: "asc",
  sortTitle: "Sort",
  onSort: () => {
    return
  }
})

const Container = styled("table")`
  width: 100%;
  border-spacing: 0;
`

export interface TableProps {
  sortBy: string
  sortDirection: string
  sortTitle: string
  onSort: (sortName: string) => void
}

export class Table extends React.PureComponent<TableProps> {
  render() {
    const { children, sortBy, sortDirection, sortTitle, onSort } = this.props
    return (
      <TableContext.Provider
        value={{ sortBy, sortDirection, sortTitle, onSort }}
      >
        <Container>{children}</Container>
      </TableContext.Provider>
    )
  }
}
