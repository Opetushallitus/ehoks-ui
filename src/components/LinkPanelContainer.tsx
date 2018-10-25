import React from "react"
import styled from "styled"

export interface LinkPanelContainerProps {
  className?: string
}

const Container = styled("div")`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0;
  flex: 1;
`

export class LinkPanelContainer extends React.Component<
  LinkPanelContainerProps
> {
  render() {
    const { children, className } = this.props
    return <Container className={className}>{children}</Container>
  }
}
