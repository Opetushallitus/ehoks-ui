import { RouteComponentProps } from "@reach/router"
import { Container, PaddedContent } from "components/Container"
import { ContentContainer } from "components/ContentContainer"
import { MainHeading } from "components/Heading"
import { inject, observer } from "mobx-react"
import React from "react"
import { FormattedMessage } from "react-intl"
import styled from "styled"
import { ShareLinkInfo } from "components/ShareLinkInfo"
import { IRootStore } from "../stores/RootStore"
import { LoadingSpinner } from "components/LoadingSpinner"
import { NavigationContainer } from "components/NavigationContainer"

const Header = styled("h1")`
  margin: 30px 50px 30px 40px;
  color: #4a4a4a;

  @media screen and (max-width: ${props => props.theme.breakpoints.Desktop}px) {
    margin: 30px 50px 0 20px;
  }
`

const LoadingContainer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
`

export interface EtusivuProps extends RouteComponentProps {
  uuid?: string
  store?: IRootStore
}

interface ShareState {
  allLoaded: boolean
}

@inject("store")
@observer
export class Etusivu extends React.Component<EtusivuProps, ShareState> {
  state: ShareState = {
    allLoaded: false
  }

  async componentDidMount() {
    const { store, uuid } = this.props
    const { share } = store!

    if (uuid) {
      await share.fetchShareData(uuid)
    }
    if (!share.isLoading) {
      this.setState({ allLoaded: true })
    }
  }

  render() {
    const { share } = this.props.store!
    if (!this.state.allLoaded) {
      return (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      )
    }

    return (
      <React.Fragment>
        <NavigationContainer>
          <Container>
            <PaddedContent>
              <MainHeading>
                <FormattedMessage
                  id="etusivu.tyopaikantoimijantitle"
                  defaultMessage="Ammatillisten opintojen henkilökohtaistaminen"
                />
              </MainHeading>
            </PaddedContent>
          </Container>
        </NavigationContainer>
        <Container>
          <Header>
            <FormattedMessage
              id="etusivu.tyopaikantoimijantitle"
              defaultMessage="Työpaikalla oppija"
            />
          </Header>
        </Container>
        <Container>
          <ContentContainer>
            <ShareLinkInfo share={share.shareData} />
          </ContentContainer>
        </Container>
      </React.Fragment>
    )
  }
}
