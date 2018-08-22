import * as React from "react"
import styled from "react-emotion"

export interface LinkPanelContainerProps {
  className?: string
}

const Container = styled("div")`
  display: flex;
  flex-wrap: wrap;
`

export class LinkPanelContainer extends React.Component<
  LinkPanelContainerProps
> {
  render() {
    const { children, className } = this.props
    return <Container className={className}>{children}</Container>
  }
}
