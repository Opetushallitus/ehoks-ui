import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
import React from "react"
import { InjectedIntlProps, injectIntl } from "react-intl"
import { Naytto } from "models/Naytto"
import { SnapshotOrInstance } from "mobx-state-tree"

interface DemonstrationDatesProps {
  demonstration: SnapshotOrInstance<typeof Naytto>
}
export const DemonstrationDates = injectIntl(
  ({ demonstration, intl }: DemonstrationDatesProps & InjectedIntlProps) => {
    return demonstration &&
      demonstration.ajankohta &&
      demonstration.ajankohta.alku ? (
      <span>
        {intl.formatMessage({
          id: "opiskelusuunnitelma.nayttoTitle"
        })}{" "}
        {format(parseISO(demonstration.ajankohta.alku), "d.M.yyyy")}
      </span>
    ) : null
  }
)
