import React from "react"
import { renderWithContext } from "testUtils"
import { Accordion } from "../Accordion"
import { fireEvent } from "react-testing-library"

test("open=true renders collapse icon and child content", () => {
  const { getByTestId } = renderWithContext(
    <Accordion id="test" open={true}>
      Test Content
    </Accordion>
  )
  expect(getByTestId("Collapse")).toBeDefined()
  expect(getByTestId("Content").textContent).toBe("Test Content")
})

test("open=false renders expand icon and no child content", () => {
  const { getByTestId } = renderWithContext(
    <Accordion id="test" open={false}>
      Content
    </Accordion>
  )
  expect(getByTestId("Expand")).toBeDefined()
  expect(getByTestId("Content")).toBeEmpty()
})

test("onToggle prop function gets invoked with title row clicks", () => {
  const mockOnToggle = jest.fn()
  const { getByTestId } = renderWithContext(
    <Accordion id="test" open={false} onToggle={mockOnToggle}>
      Content
    </Accordion>
  )

  fireEvent.click(getByTestId("Toggle"))
  expect(mockOnToggle).toHaveBeenCalledTimes(1)
})
