import { RouteComponentProps } from "@reach/router"
import { AdditionalText } from "components/AdditionalText"
import { AvatarImage } from "components/AvatarImage"
import { Button } from "components/Button"
import { Header } from "components/Header"
import { HorizontalLine } from "components/HorizontalLine"
import { LinkItem } from "components/LinkItem"
import { ListContainer } from "components/ListContainer"
import { SubHeader } from "components/SubHeader"
import { css } from "emotion"
import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import React from "react"
import { GoGraph, GoLightBulb, GoOrganization, GoX } from "react-icons/go"
import { RootStore } from "../models/RootStore"

export interface GoalsProps {
  store?: Instance<typeof RootStore>
}

const linkItemStyles = css`
  margin-bottom: 6px;
`

const listContainerStyles = css`
  background-color: #9b96ff;
`

const listHeadingIconStyles = css`
  margin: 0 10px 0 0;
`

@inject("store")
@observer
export class Goals extends React.Component<GoalsProps & RouteComponentProps> {
  sendMessage = () => {
    // TODO
    console.log("Send message")
  }

  closeView = () => {
    // TODO
    console.log("Close view")
  }

  render() {
    // const { store } = this.props
    return (
      <div>
        <Header>Omat tavoitteeni</Header>

        <ListContainer className={listContainerStyles}>
          <SubHeader
            icon={
              <AvatarImage src="https://ui-avatars.com/api/?name=Kirsi+Korhonen&size=50" />
            }
            title="Kirsi Korhonen"
            subTitle="Ammattiopisto Studentia"
            additionalContent={<AdditionalText>14.4.-25.5.2018</AdditionalText>}
          />

          <HorizontalLine />

          <SubHeader
            icon={<GoLightBulb size="32" className={listHeadingIconStyles} />}
            title="Tehtävät työpaikalla"
            subTitle="Kuljettajana toimiminen"
            additionalContent={
              <GoX size="24" color="#fff" onClick={this.closeView} />
            }
          />

          <LinkItem
            className={linkItemStyles}
            title="Osaamisen tiedot ja urasuunnitelma"
            subTitle="Viimeisin palaute 3.5.2018"
            icon={<GoGraph size="24" color="#000" />}
            to="/404"
          />

          <LinkItem
            className={linkItemStyles}
            title="Tehtävät työpaikalla"
            subTitle="Viimeisin palaute 18.4.2018"
            icon={<GoOrganization size="24" color="#000" />}
            to="/404"
          />

          <Button onClick={this.sendMessage}>
            Lähetä viesti opiskelijalle
          </Button>
        </ListContainer>
      </div>
    )
  }
}
