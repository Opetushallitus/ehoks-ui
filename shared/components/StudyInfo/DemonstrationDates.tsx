import { TempDemonstration } from "components/StudyInfo"
import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
import React from "react"
import { InjectedIntlProps, injectIntl } from "react-intl"

interface DemonstrationDatesProps {
  demonstration: TempDemonstration // TODO: use correct interface
}
export const DemonstrationDates = injectIntl(
  ({ demonstration, intl }: DemonstrationDatesProps & InjectedIntlProps) => {
    return demonstration ? (
      <span>
        {intl.formatMessage({
          id: "opiskelusuunnitelma.nayttoTitle"
        })}{" "}
        {format(parseISO(demonstration.period[0]), "d.M.yyyy")}
      </span>
    ) : null
  }
)
