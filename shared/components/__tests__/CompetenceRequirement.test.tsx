import React from "react"
import { renderWithContext } from "testUtils"
import { CompetenceRequirement } from "../CompetenceRequirement"
import { Osaamisvaatimus } from "models/Osaamisvaatimus"
import { fireEvent } from "@testing-library/react"

const competenceRequirement = Osaamisvaatimus.create({
  kuvaus: "ammattitaitovaatimuksen kuvaus",
  kriteerit: [
    {
      kuvaus: "Tyydyttävä T1",
      kriteerit: ["1", "2", "3"]
    },
    {
      kuvaus: "Tyydyttävä T2",
      kriteerit: []
    },
    {
      kuvaus: "Hyvä H3",
      kriteerit: ["1", "2", "3"]
    },
    {
      kuvaus: "Hyvä H4",
      kriteerit: []
    },
    {
      kuvaus: "Kiitettävä K5",
      kriteerit: ["1", "2", "3"]
    }
  ]
})

test("expanded=false renders only title", () => {
  const mockExpand = jest.fn()
  const { getByTestId, queryByTestId } = renderWithContext(
    <CompetenceRequirement
      competenceRequirement={competenceRequirement}
      expanded={false}
      expand={mockExpand}
    />
  )
  expect(getByTestId("ToggleAssessment").textContent).toBe(
    "Näytä arviointikriteerit"
  )
  expect(queryByTestId("Assessment")).not.toBeInTheDocument()
})

test("expanded=true renders title and assessment items", () => {
  const mockExpand = jest.fn()
  const { getByTestId } = renderWithContext(
    <CompetenceRequirement
      competenceRequirement={competenceRequirement}
      expanded={true}
      expand={mockExpand}
    />
  )
  expect(getByTestId("ToggleAssessment").textContent).toBe(
    "Piilota arviointikriteerit"
  )
  expect(getByTestId("Assessment")).toBeInTheDocument()
})

test("click toggle assessment button calls expand callback", () => {
  const mockExpand = jest.fn()
  const { getByTestId } = renderWithContext(
    <CompetenceRequirement
      competenceRequirement={competenceRequirement}
      expanded={false}
      expand={mockExpand}
    />
  )
  fireEvent.click(getByTestId("ToggleAssessment"))
  expect(mockExpand).toHaveBeenCalledTimes(1)
})
