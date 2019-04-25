import addDays from "date-fns/addDays"
import format from "date-fns/format"
import { MockStudent } from "./MockStudent"

const firstNames = [
  "Matti",
  "Timo",
  "Juha",
  "Kari",
  "Antti",
  "Tuula",
  "Ritva",
  "Leena",
  "Anne",
  "Päivi"
]
const lastNames = [
  "Korhonen",
  "Virtanen",
  "Mäkinen",
  "Nieminen",
  "Mäkelä",
  "Hämäläinen",
  "Laine",
  "Heikkinen",
  "Koskinen",
  "Järvinen"
]

const qualifications = [
  "Sosiaali- ja terveysalan perustutkinto",
  "Ravintola- ja catering-alan perustutkinto",
  "Autoalan perustutkinto",
  "Musiikkialan perustutkinto",
  "Tieto- ja viestintätekniikan perustutkinto",
  "Liiketoiminnan perustutkinto"
]

const competenceAreas = [
  "Ikääntyvien hoidon ja kuntoutumisen osaamisala",
  "Jalkojenhoidon osaamisala",
  "Suunhoidon osaamisala",
  "Autokorinkorjauksen osaamisala",
  "Autotekniikan osaamisala",
  "Asiakaspalvelun osaamisala",
  "Ruokapalvelun osaamisala",
  "Musiikin osaamisala",
  "Pianonvirityksen osaamisala",
  "Ohjelmistotuotannon osaamisala"
]

const startRange = [1451606400000, 1514764800000]

export const mockStudents: MockStudent[] = Array.from(Array(100).keys()).map(
  key => {
    const startingDate = new Date(
      Math.floor(
        Math.random() * (startRange[1] - startRange[0] + 1) + startRange[0]
      )
    )
    const acceptedDate = addDays(
      startingDate,
      Math.floor(Math.random() * (30 - 7 + 1) + 7)
    )
    const updateDate = addDays(
      acceptedDate,
      Math.floor(Math.random() * (120 - 7 + 1) + 7)
    )
    return {
      id: key,
      nimi: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
        lastNames[Math.floor(Math.random() * firstNames.length)]
      }`,
      tutkinto:
        qualifications[Math.floor(Math.random() * qualifications.length)],
      osaamisala:
        competenceAreas[Math.floor(Math.random() * competenceAreas.length)],
      hyvaksytty: format(acceptedDate, "yyyy-MM-dd"),
      paivitetty: format(updateDate, "yyyy-MM-dd"),
      lukumaara: 1
    }
  }
)
