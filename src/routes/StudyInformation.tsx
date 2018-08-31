import { RouteComponentProps } from "@reach/router"
import { ListContainer } from "components/ListContainer"
import { ListHeading } from "components/ListHeading"
import { css } from "emotion"
import { inject, observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import React from "react"
import { GoLightBulb } from "react-icons/go"
import { RootStore } from "../models/RootStore"

export interface StudyInformationProps {
  store?: Instance<typeof RootStore>
}

const listContainerStyles = css`
  background-color: #68d1e3;
`

const listHeadingStyles = css`
  color: #fff;
`

const listHeadingIconStyles = css`
  margin: 0 10px 0 0;
`

@inject("store")
@observer
export class StudyInformation extends React.Component<
  StudyInformationProps & RouteComponentProps
> {
  close = () => console.log("closing")

  render() {
    // const { store } = this.props
    return (
      <div>
        <ListContainer className={listContainerStyles}>
          <ListHeading
            className={listHeadingStyles}
            icon={<GoLightBulb size="48" className={listHeadingIconStyles} />}
            onClose={this.close}
            titleSize="large"
          >
            Opintotietoa
          </ListHeading>
        </ListContainer>
      </div>
    )
  }
}
