import { TempLearningPeriod } from "components/StudyInfo"
import format from "date-fns/format"
import React from "react"
import { InjectedIntlProps, injectIntl } from "react-intl"

interface LearningPeriodDatesProps {
  learningPeriod: TempLearningPeriod // TODO: use correct interface
}
export const LearningPeriodDates = injectIntl(
  ({ learningPeriod, intl }: LearningPeriodDatesProps & InjectedIntlProps) => {
    return learningPeriod.approved ? (
      <span>
        {intl.formatMessage({
          defaultMessage: "Hyväksytty",
          id: "opiskelusuunnitelma.approved"
        })}{" "}
        {format(learningPeriod.approved, "d.M.YYYY")}
      </span>
    ) : learningPeriod.period[0] && learningPeriod.period[1] ? (
      <span>
        {format(learningPeriod.period[0], "d.M.")} {" - "}
        {format(learningPeriod.period[1], "d.M.YYYY")}
      </span>
    ) : null
  }
)
