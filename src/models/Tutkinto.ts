import { types } from "mobx-state-tree"

export const tutkinnotMock = [
  {
    competenceAreas: [
      "Elintarviketeknologian osaamisala",
      "Meijerialan osaamisala",
      "Liha-alan osaamisala",
      "Leipomoalan osaamisala"
    ],
    link: "https://eperusteet.opintopolku.fi/#/fi/kooste/1463484",
    qualificationTitles: [
      "Elintarvikkeiden valmistaja",
      "Leipuri-kondiittori",
      "Lihatuotteiden valmistaja",
      "Meijeristi"
    ],
    title: "Elintarvikealan perustutkinnon perusteet"
  },
  {
    competenceAreas: [
      "Elintarviketeknologian osaamisala",
      "Meijerialan osaamisala",
      "Liha-alan osaamisala",
      "Leipomoalan osaamisala"
    ],
    link: "https://eperusteet.opintopolku.fi/#/fi/kooste/1463484",
    qualificationTitles: [
      "Elintarvikkeiden valmistaja",
      "Leipuri-kondiittori",
      "Lihatuotteiden valmistaja",
      "Meijeristi"
    ],
    title: "Elintarvikealan perustutkinnon perusteet"
  },
  {
    competenceAreas: [
      "Elintarviketeknologian osaamisala",
      "Meijerialan osaamisala",
      "Liha-alan osaamisala",
      "Leipomoalan osaamisala"
    ],
    link: "https://eperusteet.opintopolku.fi/#/fi/kooste/1463484",
    qualificationTitles: [
      "Elintarvikkeiden valmistaja",
      "Leipuri-kondiittori",
      "Lihatuotteiden valmistaja",
      "Meijeristi"
    ],
    title: "Elintarvikealan perustutkinnon perusteet"
  },
  {
    competenceAreas: [
      "Elintarviketeknologian osaamisala",
      "Meijerialan osaamisala",
      "Liha-alan osaamisala",
      "Leipomoalan osaamisala"
    ],
    link: "https://eperusteet.opintopolku.fi/#/fi/kooste/1463484",
    qualificationTitles: [
      "Elintarvikkeiden valmistaja",
      "Leipuri-kondiittori",
      "Lihatuotteiden valmistaja",
      "Meijeristi"
    ],
    title: "Elintarvikealan perustutkinnon perusteet"
  },
  {
    competenceAreas: [
      "Elintarviketeknologian osaamisala",
      "Meijerialan osaamisala",
      "Liha-alan osaamisala",
      "Leipomoalan osaamisala"
    ],
    link: "https://eperusteet.opintopolku.fi/#/fi/kooste/1463484",
    qualificationTitles: [
      "Elintarvikkeiden valmistaja",
      "Leipuri-kondiittori",
      "Lihatuotteiden valmistaja",
      "Meijeristi"
    ],
    title: "Elintarvikealan perustutkinnon perusteet"
  },
  {
    competenceAreas: [
      "Elintarviketeknologian osaamisala",
      "Meijerialan osaamisala",
      "Liha-alan osaamisala",
      "Leipomoalan osaamisala"
    ],
    link: "https://eperusteet.opintopolku.fi/#/fi/kooste/1463484",
    qualificationTitles: [
      "Elintarvikkeiden valmistaja",
      "Leipuri-kondiittori",
      "Lihatuotteiden valmistaja",
      "Meijeristi"
    ],
    title: "Leipurin perustutkinnon perusteet"
  },
  {
    competenceAreas: [
      "Elintarviketeknologian osaamisala",
      "Meijerialan osaamisala",
      "Liha-alan osaamisala",
      "Leipomoalan osaamisala"
    ],
    link: "https://eperusteet.opintopolku.fi/#/fi/kooste/1463484",
    qualificationTitles: [
      "Elintarvikkeiden valmistaja",
      "Leipuri-kondiittori",
      "Lihatuotteiden valmistaja",
      "Meijeristi"
    ],
    title: "Leipurin perustutkinnon perusteet"
  },
  {
    competenceAreas: [
      "Elintarviketeknologian osaamisala",
      "Meijerialan osaamisala",
      "Liha-alan osaamisala",
      "Leipomoalan osaamisala"
    ],
    link: "https://eperusteet.opintopolku.fi/#/fi/kooste/1463484",
    qualificationTitles: [
      "Elintarvikkeiden valmistaja",
      "Leipuri-kondiittori",
      "Lihatuotteiden valmistaja",
      "Meijeristi"
    ],
    title: "Leipurin perustutkinnon perusteet"
  },
  {
    competenceAreas: [
      "Elintarviketeknologian osaamisala",
      "Meijerialan osaamisala",
      "Liha-alan osaamisala",
      "Leipomoalan osaamisala"
    ],
    link: "https://eperusteet.opintopolku.fi/#/fi/kooste/1463484",
    qualificationTitles: [
      "Elintarvikkeiden valmistaja",
      "Leipuri-kondiittori",
      "Lihatuotteiden valmistaja",
      "Meijeristi"
    ],
    title: "Leipurin perustutkinnon perusteet"
  },
  {
    competenceAreas: [
      "Elintarviketeknologian osaamisala",
      "Meijerialan osaamisala",
      "Liha-alan osaamisala",
      "Leipomoalan osaamisala"
    ],
    link: "https://eperusteet.opintopolku.fi/#/fi/kooste/1463484",
    qualificationTitles: [
      "Elintarvikkeiden valmistaja",
      "Leipuri-kondiittori",
      "Lihatuotteiden valmistaja",
      "Meijeristi"
    ],
    title: "Leipurin perustutkinnon perusteet"
  }
]

export const Tutkinto = types.model("Tutkinto", {
  competenceAreas: types.array(types.string),
  link: types.string,
  qualificationTitles: types.array(types.string),
  title: types.string
})
