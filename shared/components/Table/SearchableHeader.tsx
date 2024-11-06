import { TableContext } from "components/Table"
import React from "react"
import { useIntl } from "react-intl"
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md"
import styled from "styled"

const Container = styled("th")`
  border-bottom: 1px solid ${(props) => props.theme.colors.table.cellBorder};
  padding: 15px 15px 15px 0;
`

const Button = styled("span")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`

const Text = styled("span")`
  font-size: 14px;
`

interface ArrowProps {
  active: boolean
  disabled: boolean
}

const ArrowUp = styled(({ disabled: _disabled, active: _active, ...rest }) => (
  <MdArrowDropUp {...rest} />
))<ArrowProps>`
  color: ${(props) =>
    props.disabled ? "#F0F0F0" : props.active ? "#229FC9" : "#84898C"};
`

const ArrowDown = styled(
  ({ disabled: _disabled, active: _active, ...rest }) => (
    <MdArrowDropDown {...rest} />
  )
)<ArrowProps>`
  color: ${(props) =>
    props.disabled ? "#F0F0F0" : props.active ? "#229FC9" : "#84898C"};
  margin-top: -24px;
`

const ArrowContainer = styled("div")`
  display: flex;
  flex-direction: column;
`

const SearchInput = styled("input")`
  border: 1px solid #6e6e7e;
  border-radius: 2px;
  color: #6e6e7e;
  font-size: 16px;
  height: 40px;
  padding: 0 10px;
  width: 100%;

  @media screen and (max-width: ${(props) =>
      props.theme.breakpoints.Tablet}px) {
    padding-left: 40px;
  }
`

interface SearchableHeaderProps {
  sortName: string
  omitSortButtons?: boolean
  children: React.ReactNode
}

export const SearchableHeader = (props: SearchableHeaderProps) => {
  const sortByKeypress =
    (onSort: () => void) => (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        onSort()
      }
    }

  const intl = useIntl()
  const { children, sortName, omitSortButtons } = props

  const placeholder = intl.formatMessage({
    id: "table.haePlaceholder"
  })

  return (
    <TableContext.Consumer>
      {({
        sortBy,
        sortDirection,
        sortTitle,
        searchTexts,
        onSort,
        onUpdateSearchText
      }) => {
        const activeSort = sortBy === sortName
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
              onClick={omitSortButtons ? undefined : changeSort}
              onKeyPress={sortByKeypress(changeSort)}
              tabIndex={0}
              role="button"
              title={sortTitle}
            >
              <Text>{children}</Text>{" "}
              <ArrowContainer>
                <ArrowUp
                  size="32"
                  aria-hidden={true}
                  focusable="false"
                  active={activeSort && sortDirection === "asc"}
                  disabled={omitSortButtons}
                />
                <ArrowDown
                  size="32"
                  aria-hidden={true}
                  focusable="false"
                  active={activeSort && sortDirection === "desc"}
                  disabled={omitSortButtons}
                />
              </ArrowContainer>
            </Button>
            <SearchInput
              placeholder={placeholder}
              onChange={onUpdateSearchText(sortName)}
              value={searchTexts[sortName]}
            />
          </Container>
        )
      }}
    </TableContext.Consumer>
  )
}
