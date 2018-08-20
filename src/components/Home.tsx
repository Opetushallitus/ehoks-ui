import { Link, RouteComponentProps } from "@reach/router"
import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import * as React from "react"
import styled from "react-emotion"
import { FormattedMessage } from "react-intl"
import { RootStore } from "../models/RootStore"

const StyledLink = styled(Link)`
  display: block;
`

export interface HomeProps {
  store?: Instance<typeof RootStore>
}

@inject("store")
@observer
export class Home extends React.Component<HomeProps & RouteComponentProps> {
  render() {
    // const { store } = this.props
    return (
      <div>
        <h1>Polkuni osaamiseen</h1>
        <FormattedMessage id="language" />
        <StyledLink to="/learnings">Työpaikalla</StyledLink>
        <StyledLink to="/goals">Omat tavoitteeni</StyledLink>
        <StyledLink to="/studies">Tietoa opinnoista</StyledLink>
        <StyledLink to="/profile">Omat tietoni</StyledLink>
      </div>
    )
  }
}
