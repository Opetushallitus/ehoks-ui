import { Link, LinkProps } from "@reach/router"
import React from "react"
import styled, { css } from "react-emotion"
import { breakpoints } from "utils"

const LinkPanelContainer = styled("div")`
  background-color: ${(props: LinkPanelProps) =>
    props.backgroundColor || "#00AC3D"};
  border: 1px solid #979797;
  margin: 0 0 10px 10px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
`

const Content = styled("div")`
  flex-direction: column;
  display: flex;
  padding: 10px;
`

const Image = styled("div")`
  background-image: url(${(props: LinkPanelProps) => props.image});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  flex: 1;
`

const Title = styled("div")`
  font-size: 16px;
  font-weight: 300;
  text-transform: uppercase;
`
const Description = styled("div")`
  font-size: 16px;
  font-weight: 300;
`

const linkStyles = css`
  display: block;
  text-decoration: none;
  color: #fff;
  flex: 1;

  @media screen and (max-width: ${breakpoints.Desktop}px) {
    flex: auto;
  }
`

export interface LinkPanelProps {
  backgroundColor?: string
  image?: string
  title?: string
  description?: string
}

export class LinkPanel extends React.Component<LinkPanelProps & LinkProps<{}>> {
  render() {
    const { backgroundColor, to, title, description, image } = this.props
    return (
      <Link className={linkStyles} to={to}>
        <LinkPanelContainer backgroundColor={backgroundColor}>
          <Content>
            <Title>{title}</Title>
            <Description>{description}</Description>
          </Content>
          <Image image={image} />
        </LinkPanelContainer>
      </Link>
    )
  }
}
