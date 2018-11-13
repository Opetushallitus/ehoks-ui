import React from "react"
import { createRendererWithContext } from "testUtils"
import { CompetenceRequirement } from "../CompetenceRequirement"

test("expanded=false renders only title", () => {
  const mockExpand = jest.fn()
  const tree = createRendererWithContext(
    <CompetenceRequirement
      text="Test"
      assessment={{ firstCategory: ["1", "2", "3"] }}
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
      text="Test"
      assessment={{
        firstCategory: ["1", "2", "3"],
        secondCategory: ["4", "5", "6"]
      }}
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
      text="Test"
      assessment={{
        firstCategory: ["1", "2", "3"],
        secondCategory: ["4", "5", "6"]
      }}
      expanded={false}
      expand={mockExpand}
    />
  )
  const toggleButton = tree.findByTestId("ToggleAssessment")
  toggleButton.props.onClick()
  expect(mockExpand).toHaveBeenCalledTimes(1)
})
