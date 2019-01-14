import React, { ReactNode } from "react"

export interface PagingProps {
  itemsLength?: number
  perPage?: number
  children: (
    obj: {
      activePage: number
      goToPage: (index: number) => () => void
      totalPages: number
    }
  ) => ReactNode
}

export class Paging extends React.Component<PagingProps> {
  state = {
    activePage: 0
  }

  goToPage = (index: number) => () => {
    this.setState({ activePage: index })
  }

  render() {
    const { children, itemsLength = 0, perPage = 0 } = this.props
    const { activePage } = this.state
    const totalPages = Math.ceil(itemsLength / perPage)
    return children({
      activePage,
      goToPage: this.goToPage,
      totalPages
    })
  }
}
