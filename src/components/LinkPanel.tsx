import { Link, LinkProps } from "@reach/router"
import * as React from "react"
import styled, { css } from "react-emotion"

const LinkPanelContainer = styled("div")`
  background-color: ${(props: LinkPanelProps) =>
    props.backgroundColor || "#fff"};
  border-radius: 4px;
  margin: 0 0 10px 10px;
`

const Content = styled("div")`
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
`

const Icon = styled("div")``
const Text = styled("div")`
  font-size: 24px;
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
          <Content>
            <Icon>{icon}</Icon>
            <Text>{children}</Text>
          </Content>
        </LinkPanelContainer>
      </Link>
    )
  }
}
