import { RouteComponentProps } from "@reach/router"
import { Container } from "components/Container"
import { ContentContainer } from "components/ContentContainer"
import { inject, observer } from "mobx-react"
import React from "react"
import { FormattedMessage } from "react-intl"
import { IRootStore } from "stores/RootStore"
import styled from "styled"

const Header = styled("h1")`
  margin: 30px 50px 30px 40px;
  color: #4a4a4a;

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    margin: 30px 50px 0 20px;
  }
`
export interface EtusivuProps extends RouteComponentProps {
  store?: IRootStore
}

@inject("store")
@observer
export class Etusivu extends React.Component<EtusivuProps> {
  render() {
    return (
      <Container>
        <Header>
          <FormattedMessage
            id="etusivu.tyopaikantoimijantitle"
            defaultMessage="Työpaikantoimijan Etusivu"
          />
        </Header>

        <ContentContainer>
          <FormattedMessage
            id="etusivu.tyopaikantoimijansivu"
            defaultMessage="Työpaikan toimijan ui:n placeholder"
          />
        </ContentContainer>
      </Container>
    )
  }
}
