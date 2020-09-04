import { RouteComponentProps, Router } from "@reach/router"
import { Container } from "components/Container"
import { ContentContainer } from "components/ContentContainer"
import { inject, observer } from "mobx-react"
import React from "react"
import { FormattedMessage } from "react-intl"
import { IRootStore } from "stores/RootStore"
import styled from "styled"
import { ShareLinkInfo } from "components/ShareLinkInfo"

const Header = styled("h1")`
  margin: 30px 50px 30px 40px;
  color: #4a4a4a;

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    margin: 30px 50px 0 20px;
  }
`
export interface EtusivuProps extends RouteComponentProps {
  uuid?: string
}

@observer
export class Etusivu extends React.Component<EtusivuProps> {
  render() {
    const { uuid } = this.props

    return (
      <Container>
        <Header>
          <FormattedMessage
            id="etusivu.tyopaikantoimijantitle"
            defaultMessage="Sinulle jaetun linkin tiedot"
          />
        </Header>
        <ContentContainer>
          <ShareLinkInfo uuid={uuid} />
        </ContentContainer>
      </Container>
    )
  }
}
