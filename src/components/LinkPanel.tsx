import { Link, LinkProps } from "@reach/router"
import * as React from "react"
import styled, { css } from "react-emotion"

const LinkPanelContainer = styled("div")`
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  width: 100%;
  background-color: ${(props: LinkPanelProps) =>
    props.backgroundColor || "#fff"};
`

const Icon = styled("div")``
const Text = styled("div")`
  font-size: 28px;
  font-weight: bold;
`

const linkStyles = css`
  display: block;
  width: 50%;
  text-decoration: none;
  color: #fff;
`

export interface LinkPanelProps {
  backgroundColor?: string
  icon?: React.ReactNode
}

export class LinkPanel extends React.Component<LinkPanelProps & LinkProps<{}>> {
  render() {
    const { backgroundColor, children, icon, to } = this.props
    return (
      <Link className={linkStyles} to={to}>
        <LinkPanelContainer backgroundColor={backgroundColor}>
          <Icon>{icon}</Icon>
          <Text>{children}</Text>
        </LinkPanelContainer>
      </Link>
    )
  }
}
