import React from "react"
import formatFn from "date-fns/format"
import parseISO from "date-fns/parseISO"
interface FormattedDateProps {
  date?: string
  format?: string
  dateNotSet?: React.ReactNode
}
export const FormattedDate = ({
  date,
  format = "d.M.yyyy",
  dateNotSet = "-"
}: FormattedDateProps) => (
  <React.Fragment>
    {date ? formatFn(parseISO(date), format) : dateNotSet}
  </React.Fragment>
)
