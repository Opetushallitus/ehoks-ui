import React from "react"
import styled from "styled"

interface TableContextProps {
  sortBy?: string
  sortDirection: string
  sortTitle: string
  searchTexts: { [name: string]: string }
  onSort: (sortName: string) => void
  onUpdateSearchText: (
    field: string
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void
}
export const TableContext = React.createContext<TableContextProps>({
  sortDirection: "asc",
  sortTitle: "Sort",
  searchTexts: {},
  onSort: () => false,
  onUpdateSearchText: () => () => false
})

const Container = styled("table")`
  width: 100%;
  border-spacing: 0;
`

export interface TableProps {
  className?: string
  sortBy: string
  sortDirection: string
  sortTitle: string
  searchTexts: { [name: string]: string }
  onSort: (sortName: string) => void
  onUpdateSearchText: (
    field: string
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void
  children: React.ReactNode
}

export class Table extends React.PureComponent<TableProps> {
  render() {
    const {
      children,
      className,
      sortBy,
      sortDirection,
      sortTitle,
      searchTexts,
      onSort,
      onUpdateSearchText
    } = this.props
    return (
      <TableContext.Provider
        value={{
          sortBy,
          sortDirection,
          sortTitle,
          searchTexts,
          onSort,
          onUpdateSearchText
        }}
      >
        <Container className={className}>{children}</Container>
      </TableContext.Provider>
    )
  }
}
