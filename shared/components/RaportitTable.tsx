import React, { useMemo } from "react"
import { Column, useTable } from "react-table"

interface HoksRow {
  hoksid: number
  hokseid: string
  oppijaoid: string
  opiskeluoikeusoid: string
  oppilaitosoid: string
}

interface RaportitTableProps {
  data: HoksRow[] | undefined
  columns: Column[]
}

export function RaportitTable(props: RaportitTableProps) {
  const data = useMemo(() => props.data, [props.data])!

  const columns = useMemo(() => props.columns, [props.columns])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns, data })
  /* eslint-disable react/jsx-key */
  /* the jsx key is provided in the .get*Props() spreads. */
  return (
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
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
