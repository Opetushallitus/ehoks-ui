import { TempLearningPeriod } from "components/StudyInfo"
import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
import React from "react"
import { InjectedIntlProps, injectIntl } from "react-intl"

interface LearningPeriodDatesProps {
  learningPeriod: TempLearningPeriod // TODO: use correct interface
}
export const LearningPeriodDates = injectIntl(
  ({ learningPeriod, intl }: LearningPeriodDatesProps & InjectedIntlProps) => {
    if (!learningPeriod) {
      return null
    }
    const { approved, period = [] } = learningPeriod
    return approved ? (
      <span>
        {intl.formatMessage({
          id: "opiskelusuunnitelma.hyvaksyttyTitle"
        })}{" "}
        {format(parseISO(approved), "d.M.yyyy")}
      </span>
    ) : period[0] && period[1] ? (
      <span>
        {format(parseISO(period[0]), "d.M.")} {" - "}
        {format(parseISO(period[1]), "d.M.yyyy")}
      </span>
    ) : null
  }
)
