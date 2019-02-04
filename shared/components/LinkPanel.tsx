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
  min-height: 90px;
  justify-content: space-between;
`

const Image = styled("div")`
  background-image: url(${(props: LinkPanelProps) => props.image});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  flex: 1;

  @media screen and (max-width: ${props => props.theme.breakpoints.Large}px) {
    background-position: top;
  }
`

const Title = styled("div")`
  font-size: 25px;
  font-weight: 300;
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

  @media screen and (max-width: ${props =>
      props.theme.breakpoints.SmallTablet}px) {
    flex: auto;
  }
`

export interface LinkPanelProps {
  /**
   * Background color for text container
   * @default #00AC3D
   */
  backgroundColor?: string
  /** Custom className, enables component composability */
  className?: string
  /** Image to show as background image */
  image?: string
  /** WAI-ARIA image label */
  imageLabel?: string
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
      image,
      imageLabel
    } = this.props
    return (
      <StyledLink to={to}>
        <LinkPanelContainer
          backgroundColor={backgroundColor}
          className={className}
        >
          <Content>
            <Title>{title}</Title>
            {description && <Description>{description}</Description>}
          </Content>
          <Image image={image} role="img" aria-label={imageLabel} />
        </LinkPanelContainer>
      </StyledLink>
    )
  }
}
