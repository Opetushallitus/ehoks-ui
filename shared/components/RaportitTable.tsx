// @ts-nocheck
import React, { useMemo, useEffect } from "react"
import { Column, useTable, usePagination } from "react-table"
// @ts-ignore Ignore type-checking for this library
import TableScrollbar from "react-table-scrollbar"

interface RaportitTableProps {
  data: any
  columns: Column[]
  loading: boolean
  pageCount: number
  fetchData?: (pageSize: number, pageIndex: number) => void
}

export function RaportitTable(props: RaportitTableProps) {
  const fetchData = props.fetchData

  const data = useMemo(() => props.data, [props.data])!

  const columns = useMemo(() => props.columns, [props.columns])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    { columns, data, manualPagination: true, pageCount: props.pageCount },
    usePagination
  )

  useEffect(() => {
    fetchData(pageIndex, pageSize)
  }, [pageIndex, pageSize, fetchData])

  /* eslint-disable react/jsx-key */
  /* the jsx key is provided in the .get*Props() spreads. */
  return (
    <>
      <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage
            },
            null,
            2
          )}
        </code>
      </pre>
      <TableScrollbar rows={30}>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              )
            })}
            <tr>
              {props.loading ? (
                <td colSpan="10000">Loading...</td>
              ) : (
                <td colSpan="10000">
                  Showing {page.length} of ~{props.pageCount * pageSize} results
                </td>
              )}
            </tr>
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
          </button>{" "}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </button>{" "}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </button>{" "}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </button>{" "}
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
          <select
            value={pageSize}
            onBlur={e => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[10, 20, 30, 40, 50].map(pSize => (
              <option key={pSize} value={pSize}>
                Show {pSize}
              </option>
            ))}
          </select>
        </div>
      </TableScrollbar>
    </>
  )
}
