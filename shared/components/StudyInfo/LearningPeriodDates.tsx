import { FormattedDate } from "components/FormattedDate"
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
        <FormattedDate date={hyvaksytty} />
      </span>
    ) : ajankohta && ajankohta.alku && ajankohta.loppu ? (
      <span>
        <FormattedDate date={ajankohta.alku} format="d.M." /> {"-"}
        <FormattedDate date={ajankohta.loppu} />
      </span>
    ) : null
  }
)
