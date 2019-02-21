import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
import React from "react"
import { InjectedIntlProps, injectIntl } from "react-intl"
import { Harjoittelujakso } from "models/Harjoittelujakso"
import { SnapshotOrInstance } from "mobx-state-tree"

interface LearningPeriodDatesProps {
  learningPeriod: SnapshotOrInstance<typeof Harjoittelujakso>
}
export const LearningPeriodDates = injectIntl(
  ({ learningPeriod, intl }: LearningPeriodDatesProps & InjectedIntlProps) => {
    if (!learningPeriod) {
      return null
    }
    const { hyvaksytty, ajankohta } = learningPeriod
    return hyvaksytty ? (
      <span>
        {intl.formatMessage({
          id: "opiskelusuunnitelma.hyvaksyttyTitle"
        })}{" "}
        {format(parseISO(hyvaksytty), "d.M.yyyy")}
      </span>
    ) : ajankohta && ajankohta.alku && ajankohta.loppu ? (
      <span>
        {format(parseISO(ajankohta.alku), "d.M.")} {"-"}
        {format(parseISO(ajankohta.loppu), "d.M.yyyy")}
      </span>
    ) : null
  }
)
