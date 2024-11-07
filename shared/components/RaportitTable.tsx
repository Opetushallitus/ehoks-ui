/* eslint-disable jsx-a11y/no-onchange */
// Added nocheck because I cannot get react-table types to work correctly.
import React, { useMemo, useEffect } from "react"
import {
  Column,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender
} from "@tanstack/react-table"
// @ts-ignore Ignore type-checking for this library
import { FormattedMessage } from "react-intl"
import styled from "../styled"

interface RaportitTableProps {
  data: any
  columns: Column<any, any>[]
  loading: boolean
  pageCount: number
  fetchData?: (pageSize: number, pageIndex: number) => void
}

const PaginationButtons = styled.div`
  justify-content: start;
  margin-top: 0.5rem;
  & button {
    margin-right: 0.25rem;
    width: 3rem;
  }
`

const printResultInfo = (length: number, count: number, loading: boolean) => {
  if (loading) {
    return (
      <td colSpan={10000}>
        <FormattedMessage id="raportit.ladataan" defaultMessage="Ladataan" />
        ...
      </td>
    )
  } else if (count > 1) {
    return (
      <td colSpan={10000}>
        <FormattedMessage id="raportit.naytetaan" defaultMessage="Näytetään" />{" "}
        {length} / ~{count * 10}
      </td>
    )
  } else if (count === 1) {
    return (
      <td colSpan={10000}>
        <FormattedMessage id="raportit.loytyi" defaultMessage="Löytyi" />{" "}
        {length} <FormattedMessage id="raportit.kpl" defaultMessage="kpl" />
      </td>
    )
  } else {
    return (
      <td colSpan={10000}>
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
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10
  })

  const table = useReactTable({
    columns,
    data,
    state: {
      pagination
    },
    onPaginationChange: updater => {
      setPagination(old =>
        updater instanceof Function ? updater(old) : updater
      )
    },
    getRowId: originalRow => originalRow.hoksId,
    manualPagination: true,
    pageCount: props.pageCount,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel()
  })

  useEffect(() => {
    if (fetchData) fetchData(pagination.pageSize, pagination.pageIndex)
  }, [pagination, fetchData])

  /* eslint-disable react/jsx-key */
  /* the jsx key is provided in the .get*Props() spreads. */
  return (
    <>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} colSpan={header.colSpan}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td id={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            {printResultInfo(
              table.getRowModel().rows.length,
              props.pageCount,
              props.loading
            )}
          </tr>
        </tbody>
      </table>
      {props.pageCount > 0 && (
        <PaginationButtons className="pagination" style={{}}>
          <button
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>{" "}
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>{" "}
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>{" "}
          <button
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>{" "}
          <span>
            <FormattedMessage id="raportit.sivu" defaultMessage="Sivu" />{" "}
            <strong>
              {pagination.pageIndex + 1} / {props.pageCount}
            </strong>{" "}
          </span>
        </PaginationButtons>
      )}
    </>
  )
}
