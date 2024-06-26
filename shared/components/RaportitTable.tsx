/* eslint-disable jsx-a11y/no-onchange */
// @ts-nocheck
// Added nocheck because I cannot get react-table types to work correctly.
import React, { useMemo, useEffect } from "react"
import { Column, useTable, usePagination } from "react-table"
// @ts-ignore Ignore type-checking for this library
import TableScrollbar from "react-table-scrollbar"
import { FormattedMessage } from "react-intl"

interface RaportitTableProps {
  data: any
  columns: Column[]
  loading: boolean
  pageCount: number
  fetchData?: (pageSize: number, pageIndex: number) => void
}

const printResultInfo = (length: number, count: number, loading: boolean) => {
  if (loading) {
    return (
      <td colSpan="10000">
        <FormattedMessage id="raportit.ladataan" defaultMessage="Ladataan" />
        ...
      </td>
    )
  } else if (count > 1) {
    return (
      <td colSpan="10000">
        <FormattedMessage id="raportit.naytetaan" defaultMessage="Näytetään" />{" "}
        {length} / ~{count * 10}
      </td>
    )
  } else if (count === 1) {
    return (
      <td colSpan="10000">
        <FormattedMessage id="raportit.loytyi" defaultMessage="Löytyi" />{" "}
        {length} <FormattedMessage id="raportit.kpl" defaultMessage="kpl" />
      </td>
    )
  } else {
    return (
      <td colSpan="10000">
        <FormattedMessage
          id="raportit.eiTuloksia"
          defaultMessage="Ei hakutuloksia"
        />
      </td>
    )
  }
}

export const RaportitTable = (props: RaportitTableProps) => {
  const { fetchData } = props
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
    fetchData(10, pageIndex)
  }, [pageIndex, fetchData])

  /* eslint-disable react/jsx-key */
  /* the jsx key is provided in the .get*Props() spreads. */
  return (
    <TableScrollbar rows={30}>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
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
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          <FormattedMessage id="raportit.sivu" defaultMessage="Sivu" />{" "}
          <strong>
            {pageIndex + 1} / {pageOptions.length}
          </strong>{" "}
        </span>
      </div>
    </TableScrollbar>
  )
}
