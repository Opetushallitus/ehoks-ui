import * as React from "react"
import styled from "react-emotion"

export interface ListContainerProps {
  background?: string
  className?: string
  title?: React.ReactNode
}

const Container = styled("div")`
  padding: 10px 15px;
  background-color: ${(props: ListContainerProps) =>
    props.background ? props.background : "transparent"};
  border-radius: 4px;
`

export class ListContainer extends React.Component<ListContainerProps> {
  render() {
    const { background, className, children, title } = this.props
    return (
      <Container background={background} className={className}>
        {title}
        {children}
      </Container>
    )
  }
}
