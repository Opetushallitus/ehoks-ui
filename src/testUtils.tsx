import ThemeWrapper from "components/ThemeWrapper"
import flattenDeep from "lodash.flattendeep"
import React from "react"
import { IntlProvider } from "react-intl"
import renderer from "react-test-renderer"

function defaultCreateNodeMock(): null {
  return null
}

export const createComponentWithIntl = (
  children: React.ReactNode,
  createNodeMock?: () => any,
  props = { defaultLocale: "fi", locale: "fi" }
) => {
  const options = { createNodeMock: createNodeMock || defaultCreateNodeMock }
  return renderer.create(
    <IntlProvider {...props}>{children}</IntlProvider>,
    options
  )
}

export const createThemeRenderer = (children: React.ReactNode) => {
  return renderer.create(<ThemeWrapper>{children}</ThemeWrapper>)
}

export const createRendererWithContext = (children: React.ReactNode) => {
  const tree = createComponentWithIntl(<ThemeWrapper>{children}</ThemeWrapper>)

  const mapChildrenContent = (node: any) => {
    return node.children.map((child: any) => {
      if (typeof child === "string") {
        return child
      } else {
        return mapChildrenContent(child)
      }
    })
  }

  return {
    ...tree,
    // some API sugar methods for react-test-renderer
    findByTestId: (id: string) => {
      return tree.root.find(el => {
        return el.props["data-testid"] === id
      })
    },
    findAllByTestId: (id: string) => {
      return tree.root.findAll(el => {
        return el.props["data-testid"] === id
      })
    },
    getTextContent: (node: any) => {
      return flattenDeep(mapChildrenContent(node)).join("")
    }
  }
}
