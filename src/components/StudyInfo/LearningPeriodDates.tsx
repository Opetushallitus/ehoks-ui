import { TempLearningPeriod } from "components/StudyInfo"
import format from "date-fns/format"
import React from "react"
import { InjectedIntlProps, injectIntl } from "react-intl"

interface LearningPeriodDatesProps {
  learningPeriod: TempLearningPeriod // TODO: use correct interface
}
export const LearningPeriodDates = injectIntl(
  ({ learningPeriod, intl }: LearningPeriodDatesProps & InjectedIntlProps) => {
    const { approved, period = [] } = learningPeriod
    return approved ? (
      <span>
        {intl.formatMessage({
          id: "opiskelusuunnitelma.hyvaksyttyTitle"
        })}{" "}
        {format(approved, "d.M.yyyy")}
      </span>
    ) : period[0] && period[1] ? (
      <span>
        {format(period[0], "d.M.")} {" - "}
        {format(period[1], "d.M.yyyy")}
      </span>
    ) : null
  }
)
