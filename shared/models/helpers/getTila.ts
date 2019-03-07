import min from "lodash.min"
import max from "lodash.max"

export function getTila(
  hankitunOsaamisenNaytto: any[],
  osaamisenHankkimistavat: any[]
) {
  const startDates: Date[] = []
  const endDates: Date[] = []

  hankitunOsaamisenNaytto.forEach(hon => {
    startDates.push(new Date(hon.alku))
    endDates.push(new Date(hon.loppu))
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
