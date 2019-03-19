import React from "react"
import { render, fireEvent } from "react-testing-library"
import { StudyInfo } from "../StudyInfo"
import { createRenderWithContext } from "testUtils"

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
  const { getByTestId, queryByTestId } = createRenderWithContext(
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

test("render demonstrations", () => {})

test("render learning periods", () => {})
