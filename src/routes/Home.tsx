import { RouteComponentProps } from "@reach/router"
import { ListContainer } from "components/ListContainer"
import { ListHeading } from "components/ListHeading"
import { ListItem } from "components/ListItem"
import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import { RootStore } from "models/RootStore"
import * as React from "react"

import { LinkPanel } from "components/LinkPanel"
import { LinkPanelContainer } from "components/LinkPanelContainer"
import { GoGitBranch, GoLightBulb, GoPerson, GoTools } from "react-icons/go"

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

        <LinkPanelContainer>
          <LinkPanel
            to="/learnings"
            backgroundColor="#A3A3FF"
            icon={<GoTools size="64" />}
          >
            Työpaikalla
          </LinkPanel>
          <LinkPanel
            to="/goals"
            backgroundColor="#FAC743"
            icon={<GoGitBranch size="64" />}
          >
            Omat tavoitteeni
          </LinkPanel>
          <LinkPanel
            to="/studies"
            backgroundColor="#8CD5E4"
            icon={<GoLightBulb size="64" />}
          >
            Tietoa opinnoista
          </LinkPanel>
          <LinkPanel
            to="/profile"
            backgroundColor="#B4E740"
            icon={<GoPerson size="64" />}
          >
            Omat tietoni
          </LinkPanel>
        </LinkPanelContainer>
        <ListContainer>
          <ListHeading>Viestit</ListHeading>
          <ListItem
            avatar="https://ui-avatars.com/api/?name=Auli+Ollikainen&size=50"
            title="Auli Ollikainen"
            subtitle="Opinto-ohjaaja"
            date="13:45"
          />
          <ListItem
            avatar="https://ui-avatars.com/api/?name=Pekka+Pekkola&size=50"
            title="Pekka Pekkola"
            subtitle="Opinto-ohjaaja"
            date="ma 26.2."
          />
          <ListItem
            avatar="https://ui-avatars.com/api/?name=Kirsi+Korhonen&size=50"
            title="Kirsi Korhonen"
            subtitle="Ammattiopettaja"
            date="ma 26.2."
          />
        </ListContainer>
      </div>
    )
  }
}
