import React from "react"
import { createThemeRenderer } from "testUtils"
import { Accordion } from "../Accordion"

test("open=true renders collapse icon and child content", () => {
  const tree = createThemeRenderer(
    <Accordion id="test" open={true}>
      Content
    </Accordion>
  )
  const collapse = tree.root.find(el => {
    return el.props["data-testid"] === "Collapse"
  })
  const content = tree.root.find(el => {
    return el.props["data-testid"] === "Content"
  })
  expect(collapse).toBeDefined()
  expect(content).toBeDefined()
})

test("open=false renders expand icon and no child content", () => {
  const tree = createThemeRenderer(
    <Accordion id="test" open={false}>
      Content
    </Accordion>
  )
  const expand = tree.root.find(el => {
    return el.props["data-testid"] === "Expand"
  })
  const content = tree.root.findAll(el => {
    return el.props["data-testid"] === "Content"
  })
  expect(expand).toBeDefined()
  expect(content).toEqual([])
})

test("onToggle prop function gets invoked with title row clicks", () => {
  const mockOnToggle = jest.fn()
  const tree = createThemeRenderer(
    <Accordion id="test" open={false} onToggle={mockOnToggle}>
      Content
    </Accordion>
  )

  const toggle = tree.root.find(el => {
    return el.props["data-testid"] === "Toggle"
  })
  toggle.props.onClick()
  expect(mockOnToggle).toHaveBeenCalledTimes(1)
})
