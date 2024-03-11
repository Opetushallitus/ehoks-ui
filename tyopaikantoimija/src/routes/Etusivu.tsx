import { Container, PaddedContent } from "components/Container"
import { ContentContainer } from "components/ContentContainer"
import { MainHeading } from "components/Heading"
import { inject, observer } from "mobx-react"
import React, { useState, useEffect } from "react"
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

export interface EtusivuProps {
  uuid?: string
  store?: IRootStore
}

interface ShareState {
  allLoaded: boolean
}

export const Etusivu = inject("store")(
  observer((props: EtusivuProps) => {
    const [state, setState] = useState<ShareState>({
      allLoaded: false
    })
    useEffect(() => {
      const { store, uuid } = props
      const { share } = store!

      if (uuid) {
        share.fetchShareData(uuid).then(() => {
          if (!share.isLoading) {
            setState({ allLoaded: true })
          }
        })
      } else {
        if (!share.isLoading) {
          setState({ allLoaded: true })
        }
      }
    }, [])

    const { share } = props.store!
    if (!state.allLoaded) {
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
  })
)
