import min from "lodash.min"
import max from "lodash.max"
import { OsaamisenHankkimistapa, OsaamisenOsoittaminen } from "./TutkinnonOsa"

export function getTila(
  osaamisenOsoittaminen: OsaamisenOsoittaminen[],
  osaamisenHankkimistavat: OsaamisenHankkimistapa[]
) {
  const osoittaminenStartDates: Date[] = []
  const osoittaminenEndDates: Date[] = []
  const combinedStartDates: Date[] = []
  const combinedEndDates: Date[] = []

  osaamisenOsoittaminen.forEach(oo => {
    osoittaminenStartDates.push(new Date(oo.alku))
    osoittaminenEndDates.push(new Date(oo.loppu))
    combinedStartDates.push(new Date(oo.alku))
    combinedEndDates.push(new Date(oo.loppu))
  })
  osaamisenHankkimistavat.forEach(oht => {
    combinedStartDates.push(new Date(oht.alku))
    combinedEndDates.push(new Date(oht.loppu))
  })

  const minStartDate = min(combinedStartDates)
  const maxEndDate = max(combinedEndDates)
  const minOsoittaminenDate = min(osoittaminenStartDates)
  const maxOsoittaminenDate = max(osoittaminenEndDates)
  const endCutoffDate = new Date(new Date().setDate(new Date().getDate() - 14))

  if (!minStartDate || !maxEndDate) {
    return "suunniteltu"
  } else if (!minOsoittaminenDate || !maxOsoittaminenDate) {
    return "aikataulutettu"
  } else if (
    minOsoittaminenDate < endCutoffDate &&
    maxOsoittaminenDate < endCutoffDate
  ) {
    return "valmis"
  } else {
    return "aikataulutettu"
  }
}
