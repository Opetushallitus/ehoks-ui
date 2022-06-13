/* eslint-disable jsx-a11y/no-onchange */
// @ts-nocheck
// Added nocheck because I cannot get react-table types to work correctly.
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

const printResultInfo = (length: number, count: number, loading: boolean) => {
  if (loading) {
    return <td colSpan="10000">Ladataan...</td>
  } else if (count > 1) {
    return (
      <td colSpan="10000">
        Näytetään {length} kpl ~{count * 20} hakutuloksesta
      </td>
    )
  } else if (count === 1) {
    return <td colSpan="10000">Löytyi {length} kpl</td>
  } else if (count === 0) {
    return <td colSpan="10000">Ei tuloksia</td>
  } else {
    return (
      <td colSpan="10000">
        Näytetään {length} kpl ~{count * 20} hakutuloksesta
      </td>
    )
  }
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
    state: { pageIndex }
  } = useTable(
    { columns, data, manualPagination: true, pageCount: props.pageCount },
    usePagination
  )

  useEffect(() => {
    fetchData(20, pageIndex)
  }, [pageIndex, fetchData])

  /* eslint-disable react/jsx-key */
  /* the jsx key is provided in the .get*Props() spreads. */
  return (
    <>
      <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
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
              {printResultInfo(page.length, props.pageCount, props.loading)}
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
            Sivu{" "}
            <strong>
              {pageIndex + 1} / {pageOptions.length}
            </strong>{" "}
          </span>
        </div>
      </TableScrollbar>
    </>
  )
}
