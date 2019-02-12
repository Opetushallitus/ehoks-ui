import React from "react"
import { createRendererWithContext } from "testUtils"
import { CompetenceRequirement } from "../CompetenceRequirement"
import { Osaamisvaatimus } from "models/Osaamisvaatimus"

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
  const tree = createRendererWithContext(
    <CompetenceRequirement
      competenceRequirement={competenceRequirement}
      expanded={false}
      expand={mockExpand}
    />
  )
  const toggleButton = tree.findByTestId("ToggleAssessment")
  const assessmentItems = tree.findAllByTestId("Assessment")
  expect(tree.getTextContent(toggleButton)).toBe("Näytä arviointikriteerit")
  expect(assessmentItems.length).toBe(0)
})

test("expanded=true renders title and assessment items", () => {
  const mockExpand = jest.fn()
  const tree = createRendererWithContext(
    <CompetenceRequirement
      competenceRequirement={competenceRequirement}
      expanded={true}
      expand={mockExpand}
    />
  )
  const toggleButton = tree.findByTestId("ToggleAssessment")
  const assessment = tree.findByTestId("Assessment")
  expect(tree.getTextContent(toggleButton)).toBe("Piilota arviointikriteerit")
  expect(assessment).toBeDefined()
})

test("click toggle assessment button calls expand callback", () => {
  const mockExpand = jest.fn()
  const tree = createRendererWithContext(
    <CompetenceRequirement
      competenceRequirement={competenceRequirement}
      expanded={false}
      expand={mockExpand}
    />
  )
  const toggleButton = tree.findByTestId("ToggleAssessment")
  toggleButton.props.onClick()
  expect(mockExpand).toHaveBeenCalledTimes(1)
})
