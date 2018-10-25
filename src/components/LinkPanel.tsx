import { Link } from "@reach/router"
import React from "react"
import styled from "styled"

const LinkPanelContainer = styled("div")`
  background-color: ${(props: LinkPanelProps) =>
    props.backgroundColor || "#00AC3D"};
  border: 1px solid #979797;
  margin: 0 0 20px 0;
  min-height: 320px;
  display: flex;
  flex-direction: column;
`

const Content = styled("div")`
  flex-direction: column;
  display: flex;
  padding: 10px;
  min-height: 120px;
  justify-content: space-between;
`

const Image = styled("div")`
  background-image: url(${(props: LinkPanelProps) => props.image});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  flex: 1;
`

const Title = styled("div")`
  font-size: 18px;
  font-weight: 300;
  text-transform: uppercase;
`
const Description = styled("div")`
  font-size: 16px;
  font-weight: 300;
`

const StyledLink = styled(Link)`
  display: block;
  text-decoration: none;
  color: #fff;
  flex: 1;

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    flex: auto;
  }
`

export interface LinkPanelProps {
  /**
   * Background color for text container
   * @default #00AC3D
   */
  backgroundColor?: string
  /** Custom className, enables emotion composability */
  className?: string
  /** Image to show as background image */
  image?: string
  /** Title inside text container */
  title?: React.ReactNode
  /** Description text under title */
  description?: React.ReactNode
  /** Link URI */
  to?: string
}

/**
 *  Flexible container with title, description and image
 */
export class LinkPanel extends React.Component<LinkPanelProps> {
  render() {
    const {
      backgroundColor,
      className,
      to,
      title,
      description,
      image
    } = this.props
    return (
      <StyledLink to={to}>
        <LinkPanelContainer
          backgroundColor={backgroundColor}
          className={className}
        >
          <Content>
            <Title>{title}</Title>
            <Description>{description}</Description>
          </Content>
          <Image image={image} />
        </LinkPanelContainer>
      </StyledLink>
    )
  }
}
