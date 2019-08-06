import React from "react"
import { render, fireEvent } from "react-testing-library"
import { StudyInfo } from "../StudyInfo"
import { renderWithContext } from "testUtils"

const osaamisvaatimukset = [
  {
    kuvaus: "competence requirement",
    kriteerit: [
      {
        kuvaus: "description for first competence requirement criterion",
        kriteerit: ["1st criterion", "2nd criterion"]
      },
      {
        kuvaus: "description for second competence requirement criterion",
        kriteerit: ["1st criterion", "2nd criterion"]
      }
    ]
  }
]

test("render without params", () => {
  const { getByTestId } = render(<StudyInfo />)
  expect(getByTestId("Title")).toBeEmpty()
  expect(getByTestId("StudyInfo.Competences")).toBeEmpty()
})

test("render title", () => {
  const { getByTestId } = render(<StudyInfo title="Test" />)
  expect(getByTestId("Title").textContent).toBe("Test")
})

test("render competence requirements", () => {
  const { getByTestId, queryByTestId } = renderWithContext(
    <StudyInfo title="Test" competenceRequirements={osaamisvaatimukset} />
  )

  const expandCompetences = getByTestId(
    "StudyInfo.Competences.ExpandCompetences"
  )
  expect(
    queryByTestId("StudyInfo.Competences.CollapseCompetences")
  ).not.toBeInTheDocument()
  expect(expandCompetences).toBeInTheDocument()
  fireEvent.click(expandCompetences)

  expect(
    getByTestId("StudyInfo.Competences.CompetenceRequirements").children.length
  ).toBe(1)

  const collapseCompetences = getByTestId(
    "StudyInfo.Competences.CollapseCompetences"
  )
  expect(collapseCompetences).toBeInTheDocument()
  expect(expandCompetences).not.toBeInTheDocument()

  fireEvent.click(collapseCompetences)

  expect(
    queryByTestId("StudyInfo.Competences.CompetenceRequirements")
  ).not.toBeInTheDocument()
})

test("render demonstrations", () => {
  const {
    getByTestId,
    getAllByTestId,
    queryByTestId,
    rerender
  } = renderWithContext(
    <StudyInfo
      title="Test"
      demonstrations={[
        {
          alku: "2017-10-25",
          loppu: "2017-10-26",
          organisaatio: "Näyttöpaikka",
          ymparisto: "Näyttöympäristö",
          koulutuksenJarjestajaArvioijat: [
            "Koulu Järjestäjä, koulutuksen järjestäjä"
          ],
          tyoelamaArvioijat: ["Työ Arvioija, työelämä"],
          tyotehtavat: [
            "Elintarvikkeiden valmistus",
            "Elintarvikkeiden pakkaus"
          ],
          tyyppi: "DEMONSTRATION"
        }
      ]}
    />
  )
  expect(getByTestId("StudyInfo.DetailsCollapsed")).toBeInTheDocument()
  expect(queryByTestId("StudyInfo.DetailsExpanded")).not.toBeInTheDocument()
  expect(getAllByTestId("StudyInfo.LearningEvent").length).toBe(1)

  rerender(
    <StudyInfo
      title="Test"
      demonstrations={[
        {
          alku: "2017-10-25",
          loppu: "2017-10-26",
          organisaatio: "Näyttöpaikka",
          ymparisto: "Näyttöympäristö",
          koulutuksenJarjestajaArvioijat: [
            "Koulu Järjestäjä, koulutuksen järjestäjä"
          ],
          tyoelamaArvioijat: ["Työ Arvioija, työelämä"],
          tyotehtavat: [
            "Elintarvikkeiden valmistus",
            "Elintarvikkeiden pakkaus"
          ],
          tyyppi: "DEMONSTRATION"
        },
        {
          alku: "2017-10-25",
          loppu: "2017-10-26",
          organisaatio: "Näyttöpaikka",
          ymparisto: "Näyttöympäristö",
          koulutuksenJarjestajaArvioijat: [
            "Koulu Järjestäjä, koulutuksen järjestäjä"
          ],
          tyoelamaArvioijat: ["Työ Arvioija, työelämä"],
          tyotehtavat: [
            "Elintarvikkeiden valmistus",
            "Elintarvikkeiden pakkaus"
          ],
          tyyppi: "DEMONSTRATION"
        }
      ]}
    />
  )

  expect(getAllByTestId("StudyInfo.LearningEvent").length).toBe(2)

  fireEvent.click(getByTestId("StudyInfo.ExpandDetails"))

  expect(queryByTestId("StudyInfo.DetailsCollapsed")).not.toBeInTheDocument()
  expect(getByTestId("StudyInfo.DetailsExpanded")).toBeInTheDocument()
  expect(getAllByTestId("StudyInfo.Demonstration").length).toBe(2)
})

test("render learning periods", () => {
  const {
    getByTestId,
    getAllByTestId,
    queryByTestId,
    rerender
  } = renderWithContext(
    <StudyInfo
      title="Test"
      learningPeriods={[
        {
          alku: "2019-05-24",
          loppu: "2019-07-31",
          nimi: "Verkko-oppiminen",
          selite: "Moodle-kurssi, viestintä",
          tyyppi: "OTHER"
        }
      ]}
    />
  )
  expect(getByTestId("StudyInfo.DetailsCollapsed")).toBeInTheDocument()
  expect(queryByTestId("StudyInfo.DetailsExpanded")).not.toBeInTheDocument()
  expect(getAllByTestId("StudyInfo.LearningEvent").length).toBe(1)

  rerender(
    <StudyInfo
      title="Test"
      learningPeriods={[
        {
          alku: "2019-09-13",
          loppu: "2019-09-30",
          ohjaaja: { nimi: "John McAfee", sahkoposti: "john@mock.dev" },
          tyotehtavat: [
            "Elintarvikkeiden valmistus",
            "Elintarvikkeiden säilytys"
          ],
          selite: "Palvelutalo Koivikkola",
          tyyppi: "WORKPLACE"
        },
        {
          alku: "2019-10-01",
          loppu: "2019-10-15",
          nimi: "Verkko-oppiminen",
          selite: "Moodle-kurssi, Ikääntyminen",
          tyyppi: "OTHER"
        }
      ]}
    />
  )

  expect(getAllByTestId("StudyInfo.LearningEvent").length).toBe(2)

  fireEvent.click(getByTestId("StudyInfo.ExpandDetails"))

  expect(queryByTestId("StudyInfo.DetailsCollapsed")).not.toBeInTheDocument()
  expect(getByTestId("StudyInfo.DetailsExpanded")).toBeInTheDocument()
  expect(getAllByTestId("StudyInfo.LearningPeriod").length).toBe(2)
})

test("render verification processes", () => {
  const { queryByTestId, queryAllByTestId, rerender } = renderWithContext(
    <StudyInfo
      title="Title"
      verificationProcess={{
        koodiUri: "osaamisentodentamisenprosessi_0001"
      }}
    />
  )

  expect(queryAllByTestId("StudyInfo.LearningEvent").length).toBe(0)
  expect(queryByTestId("StudyInfo.DirectVerification")).toBeInTheDocument()

  rerender(
    <StudyInfo
      title="Title"
      verificationProcess={{
        koodiUri: "osaamisentodentamisenprosessi_0002",
        lahetettyArvioitavaksi: "2019-04-15"
      }}
    />
  )

  expect(queryAllByTestId("StudyInfo.LearningEvent").length).toBe(0)
  expect(queryByTestId("StudyInfo.AssessmentVerification")).toBeInTheDocument()

  rerender(
    <StudyInfo
      title="Title"
      demonstrations={[
        {
          alku: "2019-08-01",
          loppu: "2019-08-01",
          organisaatio: "Näyttöpaikka",
          ymparisto: "Näyttöympäristö",
          koulutuksenJarjestajaArvioijat: [
            "Olli Opettaja, koulutuksen järjestäjä",
            "Oona Opettaja, koulutuksen järjestäjä"
          ],
          tyoelamaArvioijat: ["Teuvo Työpaikka, työelämä"],
          tyotehtavat: [
            "Elintarvikkeiden valmistus",
            "Elintarvikkeiden pakkaus"
          ],
          tyyppi: "DEMONSTRATION"
        }
      ]}
      verificationProcess={{
        koodiUri: "osaamisentodentamisenprosessi_0003"
      }}
    />
  )

  expect(queryAllByTestId("StudyInfo.LearningEvent").length).toBe(1)
  expect(
    queryByTestId("StudyInfo.DemonstrationVerification")
  ).toBeInTheDocument()
})
