import React from "react"
import styled from "styled"

interface ContainerProps {
  backgroundColor?: string
  flex?: number
  padding?: string
}
const Container = styled("div")`
  flex: ${(props: ContainerProps) => (props.flex ? props.flex : 1)};
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  padding: ${(props: ContainerProps) =>
    props.padding ? props.padding : "40px 40px 20px 40px"};
  background: ${(props: ContainerProps) =>
    props.backgroundColor ? props.backgroundColor : "#000"};
  margin-right: 10px;

  &:last-child {
    margin-right: 0;
  }

  @media screen and (max-width: ${(props) =>
      props.theme.breakpoints.Desktop}px) {
    flex: 1;
    word-break: break-word;
    padding: 10px;
  }
`

const IconContainer = styled("div")`
  position: absolute;
  pointer-events: none;
  user-select: none;
`

export interface ChartBoxProps {
  /** Container background color */
  backgroundColor?: string
  /** Container CSS 'flex' property */
  flex?: number
  /** Icon to show in the background */
  icon?: React.ReactNode
  /** Container CSS 'padding' property */
  padding?: string
  children?: React.ReactNode
}

export class ChartBox extends React.Component<ChartBoxProps> {
  render() {
    const { backgroundColor, children, flex, icon, padding } = this.props
    return (
      <Container
        backgroundColor={backgroundColor}
        flex={flex}
        padding={padding}
        role="listitem"
      >
        <IconContainer>{icon}</IconContainer>
        {children}
      </Container>
    )
  }
}
