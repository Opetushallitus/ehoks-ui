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

export const mockStudents: MockStudent[] = Array.from(Array(100).keys()).map(
  key => ({
      oid: key.toString(),
      nimi: `${lastNames[Math.floor(Math.random() * lastNames.length)]} ${
        firstNames[Math.floor(Math.random() * firstNames.length)]
      }`,
      tutkinto:
        qualifications[Math.floor(Math.random() * qualifications.length)],
      osaamisala:
        competenceAreas[Math.floor(Math.random() * competenceAreas.length)],
      suunnitelmat: []
    })
)
