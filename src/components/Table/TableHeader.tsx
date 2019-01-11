import { TableContext } from "components/Table"
import React from "react"
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md"
import styled from "styled"

const Container = styled("th")`
  border-bottom: 1px solid ${props => props.theme.colors.table.cellBorder};
  padding: 15px 0;
`

const Button = styled("span")`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
`

const Text = styled("span")`
  font-size: 20px;
`

const EmptyIcon = styled("div")`
  width: 32px;
  height: 32px;
`

interface TableHeaderProps {
  sortName: string
}

export class TableHeader extends React.Component<TableHeaderProps> {
  sortByKeypress = (onSort: () => void) => (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      onSort()
    }
  }

  render() {
    const { children, sortName } = this.props
    return (
      <TableContext.Consumer>
        {({ sortBy, sortDirection, sortTitle, onSort }) => {
          const ariaProps: {
            "aria-sort": "ascending" | "descending" | "none"
          } = {
            "aria-sort":
              sortBy === sortName
                ? sortDirection === "asc"
                  ? "ascending"
                  : "descending"
                : "none"
          }

          const changeSort = () => onSort(sortName)
          return (
            <Container {...ariaProps} role="columnheader" scope="col">
              <Button
                onClick={changeSort}
                onKeyPress={this.sortByKeypress(changeSort)}
                tabIndex={0}
                role="button"
                title={sortTitle}
              >
                <Text>{children}</Text>{" "}
                {sortBy === sortName ? (
                  sortDirection === "asc" ? (
                    <MdArrowDropUp
                      size="32"
                      aria-hidden={true}
                      focusable="false"
                    />
                  ) : (
                    <MdArrowDropDown
                      size="32"
                      aria-hidden={true}
                      focusable="false"
                    />
                  )
                ) : (
                  <EmptyIcon aria-hidden={true} />
                )}
              </Button>
            </Container>
          )
        }}
      </TableContext.Consumer>
    )
  }
}
