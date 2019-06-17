import min from "lodash.min"
import max from "lodash.max"

export function getTila(
  osaamisenOsoittaminen: any[],
  osaamisenHankkimistavat: any[]
) {
  const startDates: Date[] = []
  const endDates: Date[] = []

  osaamisenOsoittaminen.forEach(oo => {
    startDates.push(new Date(oo.alku))
    endDates.push(new Date(oo.loppu))
  })
  osaamisenHankkimistavat.forEach(oht => {
    startDates.push(new Date(oht.alku))
    endDates.push(new Date(oht.loppu))
  })

  const minStartDate = min(startDates)
  const maxEndDate = max(endDates)
  const now = new Date()

  if (!minStartDate || !maxEndDate) {
    return "suunniteltu"
  } else if (minStartDate < now && maxEndDate < now) {
    return "valmis"
  } else {
    return "aikataulutettu"
  }
}
